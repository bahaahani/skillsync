import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course } from '../models/course.model';
import { HttpParams } from '@angular/common/http';
import { StudentProgress } from '../models/student-progress.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) { }

  getCourses(page: number, pageSize: number, filters?: {
    searchTerm?: string,
    level?: string,
    duration?: number | undefined,
    tags?: string[]
  }): Observable<{ courses: Course[], totalItems: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
      if (filters.level) params = params.set('level', filters.level);
      if (filters.duration !== undefined) params = params.set('duration', filters.duration.toString());
      if (filters.tags && filters.tags.length > 0) params = params.set('tags', filters.tags.join(','));
    }

    return this.http.get<{ courses: Course[], totalItems: number }>(`${this.apiUrl}`, { params });
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

  searchCourses(searchParams: { [key: string]: string | number | undefined }): Observable<any> {
    let params = new HttpParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== undefined) {
        params = params.append(key, searchParams[key]!.toString());
      }
    });
    return this.http.get<any>(`${this.apiUrl}/courses/search`, { params });
  }
  createForumPost(courseId: string, post: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/forum`, post);
  }

  getCourseDetails(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}`);
  }

  enrollInCourse(courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/enroll`, {});
  }

  addCourseFeedback(courseId: string, feedback: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/feedback`, feedback);
  }

  getForumThreads(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${courseId}/forum`);
  }

  createForumThread(courseId: string, thread: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/forum`, thread);
  }

  createForumReply(courseId: string, threadId: string, reply: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/forum/${threadId}/replies`, reply);
  }

  getEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/enrolled`);
  }

  getUpcomingDeadlines(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/upcoming-deadlines`);
  }

  getRecentActivities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent-activities`);
  }

  getCourseProgress(courseId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${courseId}/progress`);
  }

  addCourse(course: any): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}`, course);
  }

  updateCourse(courseId: string, course: any): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${courseId}`, course);
  }

  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}`);
  }

  rateCourse(courseId: string, rating: number): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/${courseId}/rate`, { rating });
  }

  getUserRating(courseId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${courseId}/user-rating`);
  }

  removeFromWishlist(courseId: string): Observable<Course> {
    return this.http.delete<Course>(`${this.apiUrl}/${courseId}/wishlist`);
  }

  addToWishlist(courseId: string): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/${courseId}/wishlist`, {});
  }

  getInstructorCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/instructor/courses`);
  }

  getCourseStudentProgress(courseId: string): Observable<StudentProgress[]> {
    return this.http.get<StudentProgress[]>(`${this.apiUrl}/courses/${courseId}/student-progress`);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }

  getDifficulties(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/difficulties`);
  }

  getRecommendations(category: string, difficulty: string): Observable<any> {
    let params = new HttpParams()
      .set('category', category)
      .set('difficulty', difficulty);
    return this.http.get<any>(`${this.apiUrl}/recommendations`, { params });
  }

  getRecommendedCourses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recommended`);
  }

  joinCourse(courseId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courseId}/join`, {});
  }
}