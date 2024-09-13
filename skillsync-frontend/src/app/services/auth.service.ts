import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    // Initialize currentUserSubject with stored user data if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.tokenSubject.next(response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
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
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/change-password`, passwordData);
  }

  updateUserPreferences(preferences: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/preferences`, preferences);
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getAuthToken(): string | null {
    return this.getToken();
  }
  getCurrentUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id;
    }
    return null;
  }
}