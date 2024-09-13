import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/courses'; // Update with your API URL

  constructor(private http: HttpClient) {}

  // Keep only one implementation of each method
  getEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/enrolled`);
  }

  getCourseProgress(courseId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${courseId}/progress`);
  }

  // Add other methods here, ensuring no duplicates
}