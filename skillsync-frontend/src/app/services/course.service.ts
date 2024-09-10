import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course } from '../models/course.model';
import { Router } from '@angular/router';

export interface Lesson {
  _id: string;
  title: string;
  completed: boolean;
}

export interface PaginatedCourses {
  courses: Course[];
  totalCount: number;
}

export interface ForumPost {
  _id: string;
  courseId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Token might be expired or invalid
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
    return throwError(() => new Error('An error occurred. Please try again later.'));
  }

  getCourses(page: number = 1, limit: number = 10): Observable<PaginatedCourses> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedCourses>(`${this.apiUrl}/courses`, { params });
  }

  addCourse(course: Omit<Course, '_id'>): Observable<Course> {
    // Ensure required fields are present
    if (!course.title || !course.category || !course.instructor) {
      throw new Error('Title, category, and instructor are required fields');
    }
    return this.http.post<Course>(`${this.apiUrl}/courses`, course);
  }

  updateCourse(courseId: string, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${courseId}`, course);
  }

  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}`);
  }

  getCourseById(courseId: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${courseId}`);
  }

  // Existing methods
  getEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/enrolled`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getRecommendedCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/recommended`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getCourseStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/stats`);
  }

  getCourseCompletion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/completion`);
  }

  rateCourse(courseId: string, rating: number): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses/${courseId}/rate`, { rating });
  }

  updateLessonProgress(courseId: string, lessonId: string, completed: boolean): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses/${courseId}/lessons/${lessonId}/progress`, { completed });
  }

  getForumPosts(courseId: string): Observable<ForumPost[]> {
    return this.http.get<ForumPost[]>(`${this.apiUrl}/courses/${courseId}/forum`);
  }

  createForumPost(courseId: string, content: string): Observable<ForumPost> {
    return this.http.post<ForumPost>(`${this.apiUrl}/courses/${courseId}/forum`, { content });
  }

  // Add these methods if they're needed
  onCourseUpdate(): Observable<Course> {
    // Implement real-time course updates logic
    return new Observable<Course>();
  }

  joinCourse(courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/join`, {});
  }

  // Add a method to get course progress
  getCourseProgress(courseId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/courses/${courseId}/progress`);
  }
}