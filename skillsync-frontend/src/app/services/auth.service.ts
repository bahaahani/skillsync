import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post<any>('/api/auth/login', { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.setToken(response.token, rememberMe);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  private setToken(token: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      sessionStorage.setItem(this.tokenKey, token);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`);
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile`, userData).pipe(
      tap(updatedUser => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      })
    );
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/change-password`, passwordData);
  }

  updateUserPreferences(preferences: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/preferences`, preferences);
  }

  // Add more user-related methods as needed
}