import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  getCourses(page: number = 1, limit: number = 10, searchQuery: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(this.apiUrl, { params });
  }

  fullTextSearch(query: string, filters?: any): Observable<any[]> {
    let params = new HttpParams().set('q', query);
    if (filters) {
      Object.keys(filters).forEach(key => {
        params = params.append(key, filters[key]);
      });
    }
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params });
  }

  advancedSearch(searchParams: {
    [key: string]: string | number | undefined
  }): Observable<any> {
    let params = new HttpParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== undefined) {
        params = params.append(key, searchParams[key]!.toString());
      }
    });
    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  getDetailedAnalytics(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/detailed-analytics`);
  }

  // ... other methods ...

  searchCourses(searchParams: {[key: string]: string | number | undefined}): Observable<any> {
    let params = new HttpParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== undefined) {
        params = params.append(key, searchParams[key]!.toString());
      }
    });
    return this.http.get<any>(`${this.apiUrl}/courses/search`, { params });
  }
}