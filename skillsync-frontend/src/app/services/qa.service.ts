import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QaService {
  private apiUrl = `${environment.apiUrl}/qa`;

  constructor(private http: HttpClient) {}

  getQuestions(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/questions/${courseId}`);
  }

  askQuestion(courseId: string, question: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ask`, { courseId, question });
  }

  answerQuestion(questionId: string, answer: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/answer`, { questionId, answer });
  }

  voteAnswer(answerId: string, vote: 'up' | 'down'): Observable<any> {
    return this.http.post(`${this.apiUrl}/vote`, { answerId, vote });
  }
}