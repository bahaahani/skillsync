import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OverviewStats, UserGrowth, CourseEnrollment, CompletionRate, CourseEngagement, RevenueStats } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) { }

  getOverallStats(): Observable<OverviewStats> {
    return this.http.get<OverviewStats>(`${this.apiUrl}/overall-stats`);
  }

  getUserGrowthStats(): Observable<UserGrowth[]> {
    return this.http.get<UserGrowth[]>(`${this.apiUrl}/user-growth`);
  }

  getEnrollmentStats(): Observable<CourseEnrollment[]> {
    return this.http.get<CourseEnrollment[]>(`${this.apiUrl}/enrollment-stats`);
  }

  getCompletionRates(): Observable<CompletionRate[]> {
    return this.http.get<CompletionRate[]>(`${this.apiUrl}/completion-rates`);
  }

  getCourseEngagement(): Observable<CourseEngagement[]> {
    return this.http.get<CourseEngagement[]>(`${this.apiUrl}/course-engagement`);
  }

  getRevenueStats(): Observable<RevenueStats> {
    return this.http.get<RevenueStats>(`${this.apiUrl}/revenue-stats`);
  }
}