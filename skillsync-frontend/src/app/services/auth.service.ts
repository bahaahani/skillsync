import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface UserProfile {
  username: string;
  email: string;
  // Add any other fields that are part of the user profile
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  register(user: { username: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  enrollInCourse(courseId: string) {
    return this.http.post(`${this.apiUrl}/enroll/${courseId}`, {});
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`);
  }

  updateUserProfile(user: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/user/profile`, user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}