import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>('/api/auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  register(user: { username: string; email: string; password: string }) {
    return this.http.post('/api/auth/register', user);
  }

  logout() {
    localStorage.removeItem('token');
  }

  enrollInCourse(courseId: string) {
    return this.http.post(`/api/enroll/${courseId}`, {});
  }

  updateUserProfile(user: any) {
    return this.http.put('/api/user', user);
  }
}