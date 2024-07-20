import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DocService {

 // private apiUrl = 'https://us-central1-analytics-af469.cloudfunctions.net/fetchDocContent';
  private apiUrl = 'https://script.google.com/macros/s/AKfycbw1qFFxeGmxaEiWsuQB2bbpCnW8_2yZexro3EbNqMXTk2gYs4gu-B5oRF5u0M1jisVtkg/exec';
  
  constructor(private http: HttpClient) {}

  getDocumentContent(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}
