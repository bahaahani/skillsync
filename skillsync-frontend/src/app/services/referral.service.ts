import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private apiUrl = `${environment.apiUrl}/referrals`;

  constructor(private http: HttpClient) {}

  generateReferralCode(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/generate`, {});
  }

  applyReferralCode(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, { code });
  }

  getReferralStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}