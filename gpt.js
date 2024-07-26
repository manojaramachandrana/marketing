const axios = require('axios');

const apiKey = 'sk-proj-cdlyRiilgHjPczlYLc4VT3BlbkFJResz4z9Jy9X3URQp0QqK';

async function main() {
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const data = {
        model: 'gpt-4o',
        //model: 'g/g-7y1RJZOPw-agent-gpt-v1', 
        //id: 'g-7y1RJZOPw-agent-gpt-v1',
        messages: [{ role: 'system', content: 'hi' }],
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log(response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error calling gpt:', error.response ? error.response.data : error.message);
    }
}

main();
