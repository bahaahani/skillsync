import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MentorshipService {
  private apiUrl = `${environment.apiUrl}/mentorship`;

  constructor(private http: HttpClient) { }

  getMentors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mentors`);
  }

  requestMentor(mentorId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, { mentorId });
  }

  getMentorshipRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/requests`);
  }

  acceptMentorshipRequest(requestId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accept`, { requestId });
  }
}