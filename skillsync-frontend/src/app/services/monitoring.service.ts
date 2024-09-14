import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private apiUrl = `${environment.apiUrl}/monitoring`;

  constructor(private http: HttpClient) {}

  logError(error: any): void {
    // Send error to backend for logging
    this.http.post(`${this.apiUrl}/log-error`, error).subscribe();
  }

  trackUserAction(action: string): void {
    // Track user actions for analytics
    this.http.post(`${this.apiUrl}/track-action`, { action }).subscribe();
  }

  reportPerformanceMetric(metric: string, value: number): void {
    // Report performance metrics
    this.http.post(`${this.apiUrl}/performance-metric`, { metric, value }).subscribe();
  }
}