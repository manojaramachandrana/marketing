import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GptService {

  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = 'sk-proj-wwdG86Cthj7goa5oOGwxT3BlbkFJ5DZhL21h7krYqF02lgNZ';  

  constructor(private http: HttpClient) {}

  queryGptModel(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [{'role': 'user', 'content': prompt}],
      max_tokens: 150,
      temperature: 0.7,
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
