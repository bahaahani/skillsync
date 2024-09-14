import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalizedLearningService {
  private apiUrl = `${environment.apiUrl}/personalized-learning`;

  constructor(private http: HttpClient) {}

  getPersonalizedPath(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/path`);
  }

  updateLearningProgress(courseId: string, progress: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/progress`, { courseId, progress });
  }

  getNextRecommendation(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/next-recommendation`);
  }

  getRecommendedCourses(userPreferences: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/recommendations`, userPreferences);
  }

  updateUserPreferences(preferences: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/preferences`, preferences);
  }

  getCourseRecommendations(userInterests: string[], completedCourses: string[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/recommendations`, { userInterests, completedCourses });
  }
}