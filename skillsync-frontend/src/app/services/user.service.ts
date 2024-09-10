import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/current`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile`, profileData);
  }

  getSocialFeed(): Observable<any> {
    return this.http.get(`${this.apiUrl}/social-feed`);
  }

  createPost(content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/social-feed/post`, { content });
  }

  getForumTopics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/forum-topics`);
  }

  createForumTopic(title: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forum-topics`, { title, content });
  }

  getUserGoals(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-goals`);
  }

  createUserGoal(title: string, dueDate: Date): Observable<any> {
    return this.http.post(`${this.apiUrl}/user-goals`, { title, dueDate });
  }

  getUserSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/settings`);
  }

  updateUserSettings(settings: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/settings`, settings);
  }

  getRecentActivities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/recent-activities`);
  }

  getSkillProgress(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/skill-progress`);
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, profileData);
  }
}