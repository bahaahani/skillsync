import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseContentService {
  private apiUrl = `${environment.apiUrl}/course-content`;

  constructor(private http: HttpClient) {}

  updateCourseContent(courseId: string, content: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseId}`, content);
  }

  getCourseContentHistory(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${courseId}/history`);
  }

  getContentVersions(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${courseId}/versions`);
  }

  compareVersions(courseId: string, versionA: string, versionB: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/compare`, {
      params: { versionA, versionB }
    });
  }

  revertToVersion(courseId: string, versionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/revert`, { versionId });
  }
}