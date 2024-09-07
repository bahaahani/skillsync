import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust this to your backend URL

  constructor(private http: HttpClient) { }

  getCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses`);
  }

  getEnrolledCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/enrolled`);
  }

  getRecommendedCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/recommended`);
  }

  addCourse(course: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses`, course);
  }

  enrollInCourse(courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/enroll`, {});
  }

  getCourseStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/stats`);
  }

  getCourseCompletion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/completion`);
  }
}