const WebSocket = require('ws');
const express = require('express');
const twilio = require('twilio');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });
const axios = require('axios');

const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();

const request = {
    config: {
        encoding: "MULAW",
        sampleRateHertz: 8000,
        languageCode: "en-GB"
    },
    interimResults: true
};

const apiKey = 'sk-proj-cdlyRiilgHjPczlYLc4VT3BlbkFJResz4z9Jy9X3URQp0QqK';
const chatGptUrl = 'https://api.openai.com/v1/chat/completions';

async function sendToChatGpt(transcription) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const data = {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: transcription }],
    };

    try {
        const response = await axios.post(chatGptUrl, data, { headers });
        console.log('ChatGPT response:', response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error calling ChatGPT:', error.response ? error.response.data : error.message);
    }
}

wss.on('connection', (ws) => {
    console.log('New WebSocket connection initiated');

    let recognizeStreamInbound = null;
    let recognizeStreamOutbound = null;
    let inboundTranscription = '';
    let callStartTime = null;
    let transcriptionCollected = false;

    const checkEveryThirtySeconds = setInterval(() => {
        if (transcriptionCollected) {
            clearInterval(checkEveryThirtySeconds);
        } else {
            const elapsedTime = Date.now() - callStartTime;
            if (elapsedTime >= 30000) { 
                transcriptionCollected = true;
                console.log('Console transcribe after 30 seconds:', inboundTranscription);
                sendToChatGpt(inboundTranscription); 
                ws.send(JSON.stringify({
                    event: 'first-thirty-seconds-transcription',
                    text: inboundTranscription
                }));
            }
        }
    }, 30000);
    
    ws.on('message', (message) => {
        const readableMessage = Buffer.isBuffer(message) ? message.toString('hex').slice(0, 100) + '...' : message;
        //console.log('Received message:', readableMessage);

        try {
            const msg = JSON.parse(message);
            switch (msg.event) {
                case 'connected':
                    console.log('New call connected');
                    callStartTime = Date.now(); 
                    transcriptionCollected = false; 
                    inboundTranscription = ''; 

                    recognizeStreamInbound = client.streamingRecognize(request)
                        .on("error", (error) => {
                            console.error('Google Cloud Speech error (inbound):', error);
                            ws.send(JSON.stringify({ event: "error", error: error.message }));
                        })
                        .on("data", data => {
                            const transcript = data.results[0].alternatives[0].transcript;
                            console.log('live-text', transcript);
                            if (!transcriptionCollected) {
                                inboundTranscription += transcript + ' ';
                                console.log('Ongoing transcribe:', inboundTranscription);
                            }

                            wss.clients.forEach(client => {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(
                                        JSON.stringify({
                                            event: "interim-transcription-inbound",
                                            text: transcript
                                        })
                                    );
                                }
                            });
                        });

                    // recognizeStreamInbound = client.streamingRecognize(request)
                    //     .on("error", (error) => {
                    //         console.error('Google Cloud Speech error (inbound):', error);
                    //         ws.send(JSON.stringify({ event: "error", error: error.message }));
                    //     })
                    //     .on("data", data => {
                    //         console.log('Inbound:', data.results[0].alternatives[0].transcript);
                    //         wss.clients.forEach(client => {
                    //             if (client.readyState === WebSocket.OPEN) {
                    //                 client.send(
                    //                     JSON.stringify({
                    //                         event: "interim-transcription-inbound",
                    //                         text: data.results[0].alternatives[0].transcript
                    //                     })
                    //                 );
                    //             }
                    //         });
                    //     });

                        recognizeStreamOutbound = client.streamingRecognize(request)
                        .on("error", (error) => {
                            console.error('Google Cloud Speech error (outbound):', error);
                            ws.send(JSON.stringify({ event: "error", error: error.message }));
                        })
                        .on("data", data => {
                            console.log('Outbound:', data.results[0].alternatives[0].transcript);
                            wss.clients.forEach(client => {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(
                                        JSON.stringify({
                                            event: "interim-transcription-outbound",
                                            text: data.results[0].alternatives[0].transcript
                                        })
                                    );
                                }
                            });
                        });
                    break;
                case 'start':
                    console.log('Starting media stream');
                    break;
                case 'media':
                    if (msg.track === 'inbound_track' || msg.track === 'outbound_track' || recognizeStreamInbound) {
                        recognizeStreamInbound.write(msg.media.payload);
                        //console.log('hi')
                    }  else {
                        console.error('Recognize stream not initialized for track:', msg.track);
                    }
                    break;
                case 'stop':
                    console.log('Call ended');
                    if (recognizeStreamInbound) {
                        recognizeStreamInbound.end();
                    }
                    if (recognizeStreamOutbound) {
                        recognizeStreamOutbound.end();
                    }
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.post('/twiml', (req, res) => {
    console.log('Received POST request for TwiML');
    console.log('Headers:', req.headers);
    console.log('entersomething', req.headers.host);

    const twimlResponse = `
        <Response>
            <Start>
                <Stream url="wss://${req.headers.host}" track="inbound_track"/>
                <Stream url="wss://${req.headers.host}" track="outbound_track"/>
            </Start>
            <Say></Say>
            <Pause length="0" />
            <Redirect method="POST">https://handler.twilio.com/twiml/EH01680de7277d051422666358aae14bb8</Redirect>
        </Response>
    `;

    res.set('Content-Type', 'text/xml');
    res.send(twimlResponse);
});

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, "analytics-af469-26d3495f9ab9.json");

server.listen(8080, () => {
    console.log('Listening on port 8080');
});

const accountSid = 'ACe7a9ca0361e0f2c2f047fc35eb53c269';
const authToken = '7cf78f8763c79ae805e4ed18afdc7919';
const clientdata = twilio(accountSid, authToken);

const toPhoneNumber = '+919361312535';
const fromPhoneNumber = '+14158303662';
const ngrokUrl = 'https://99f8-115-246-248-252.ngrok-free.app/twiml';

clientdata.calls.create({
    url: ngrokUrl,
    to: toPhoneNumber,
    from: fromPhoneNumber
}).then(call => console.log('Outgoing call initiated:', call.sid))
  .catch(error => console.error('Error initiating call:', error));
