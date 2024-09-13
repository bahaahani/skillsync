import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getOverviewStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/overview`);
  }

  getUserGrowth(period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-growth?period=${period}`);
  }

  getCourseEnrollments(period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/course-enrollments?period=${period}`);
  }

  getCourseCompletionRates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/course-completion-rates`);
  }

  getUserEngagement(period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-engagement?period=${period}`);
  }

  getRevenueStats(period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenue?period=${period}`);
  }
}