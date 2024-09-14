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

  trackUserActivity(activity: string) {
    return this.http.post(`${this.apiUrl}/track`, { activity });
  }

  getCourseEngagement(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/course-engagement/${courseId}`);
  }

  getCompletionRates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/completion-rates`);
  }

  getUserBehaviorAnalytics(userId?: string): Observable<any> {
    const url = userId 
      ? `${this.apiUrl}/user-behavior/${userId}` 
      : `${this.apiUrl}/aggregated-behavior`;
    return this.http.get<any>(url);
  }

  getCoursePerformanceMetrics(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/course-performance/${courseId}`);
  }

  generateCustomReport(params: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/custom-report`, params);
  }

  trackUserBehavior(event: string, metadata: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/track-behavior`, { event, metadata });
  }

  getCoursePerformanceMetrics(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/course-performance/${courseId}`);
  }

  generateCustomReport(params: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/custom-report`, params);
  }

  trackUserBehavior(event: string, metadata: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/track-behavior`, { event, metadata });
  }
}