import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    // Implement the registration logic here
    return this.http.post('/api/register', userData);
  }

  // Add other authentication methods as needed
}