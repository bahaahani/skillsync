import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(
    private http: HttpClient,
    private socketService: SocketService
  ) { }

  getCourses(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/courses`);
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/courses/${id}`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/courses`, courseData);
  }

  updateCourse(id: string, courseData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/courses/${id}`, courseData);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/courses/${id}`);
  }

  joinCourse(courseId: string) {
    this.socketService.joinCourse(courseId);
  }

  // Add more methods for other course-related API endpoints and Socket.IO events
}