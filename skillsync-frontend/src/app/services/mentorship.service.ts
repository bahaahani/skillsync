import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MentorshipService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust this to your backend URL

  constructor(private http: HttpClient) { }

  getAvailableMentors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mentorship/mentors`);
  }

  getMentorshipRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mentorship/requests`);
  }

  getUserMentorStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mentorship/status`);
  }

  requestMentorship(mentorId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mentorship/request`, { mentorId });
  }

  acceptMentorshipRequest(requestId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mentorship/accept`, { requestId });
  }

  becomeMentor(): Observable<any> {
    return this.http.post(`${this.apiUrl}/mentorship/become-mentor`, {});
  }
}