import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust this to your backend URL

  constructor(private http: HttpClient) {}

  // Analytics
  getAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics`);
  }

  // Assessment
  createAssessment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assessments`, data);
  }

  getAssessment(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/assessments/${id}`);
  }

  // Auth
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Course Feedback
  submitCourseFeedback(courseId: string, feedback: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/feedback`, feedback);
  }

  // Course Recommendations
  getCourseRecommendations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/course-recommendations`);
  }

  // Forum
  getForumPosts(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/forum`);
  }

  createForumPost(courseId: string, post: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/forum`, post);
  }

  // User Profile
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-profile`);
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user-profile`, profileData);
  }

  // Course Progress
  getCourseProgress(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/progress`);
  }

  updateCourseProgress(courseId: string, progressData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/progress`, progressData);
  }

  // Course Rating
  getCourseRating(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/rating`);
  }

  submitCourseRating(courseId: string, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/rating`, { rating });
  }

  // Course Details
  getCourseDetails(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}`);
  }

  // Course Content
  getCourseContent(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/content`);
  }

  // Course Enrollment
  getEnrollmentStatus(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/enrollment`);
  }

  enrollCourse(courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/enroll`, {});
  }

  unenrollCourse(courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/unenroll`, {});
  }

  // Course Catalog
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  // Dashboard
  getEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/user/enrolled-courses`);
  }

  getCourseStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/course-stats`);
  }

  getAssessmentStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/assessment-stats`);
  }

  getRecentActivities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/recent-activities`);
  }

  // Add more methods for other controllers...
}