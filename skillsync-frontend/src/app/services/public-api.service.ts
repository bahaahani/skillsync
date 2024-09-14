import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {
  private apiUrl = `${environment.apiUrl}/public-api`;
  private apiVersion = 'v1'; // Current API version

  constructor(private http: HttpClient) {}

  private getVersionedUrl(endpoint: string): string {
    return `${this.apiUrl}/${this.apiVersion}/${endpoint}`;
  }

  getCourseList(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(this.getVersionedUrl('courses'), { params: { page: page.toString(), limit: limit.toString() } });
  }

  getCourseDetails(courseId: string): Observable<any> {
    return this.http.get(this.getVersionedUrl(`courses/${courseId}`));
  }

  getUserProgress(userId: string, courseId: string): Observable<any> {
    return this.http.get(this.getVersionedUrl(`progress/${userId}/${courseId}`));
  }

  // Add more methods as needed for the public API
}