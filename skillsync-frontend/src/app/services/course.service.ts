import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course } from '../models/course.model';

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
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

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
    return this.http.get<Course[]>(`${this.apiUrl}/courses/enrolled`);
  }

  getRecommendedCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/recommended`);
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