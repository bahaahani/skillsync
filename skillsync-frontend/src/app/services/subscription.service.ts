import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  getSubscriptionPlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/plans`);
  }

  getCurrentSubscription(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/current`);
  }

  subscribe(planId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscribe`, { planId });
  }

  cancelSubscription(): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancel`, {});
  }

  isPremiumContent(contentId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-premium/${contentId}`);
  }
}