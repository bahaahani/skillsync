import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebsocketService } from './websocket.service';
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  joinCourse(courseId: string) {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/join`, {});
  }
  onCourseUpdate() {
    return this.websocketService.onCourseUpdate();
  }
  private apiUrl = 'http://localhost:3000/api'; // Adjust this to your backend URL

  constructor(private http: HttpClient, private websocketService: WebsocketService) { }

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