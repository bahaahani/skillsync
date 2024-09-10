import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust this to your backend URL

  constructor(private http: HttpClient) { }

  getLearningPath(): Observable<any> {
    return this.http.get(`${this.apiUrl}/learning-path`);
  }

  getSuggestedCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/learning-path/suggested-courses`);
  }

  getSuggestedAssessments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/learning-path/suggested-assessments`);
  }
}