import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';
import { ErrorHandlingService } from './error-handling.service';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { User, CourseStats, AssessmentStats, Activity } from '../models/dashboard.model';
import { environment } from '../../environments/environment';

/**
 * Service responsible for making API calls to the backend.
 * This service handles all the HTTP requests for the application.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cacheService: CacheService,
    private errorHandler: ErrorHandlingService
  ) { }

  /**
   * Retrieves analytics data from the server.
   * @returns An Observable of analytics data.
   * @throws An error if the request fails.
   */
  getAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Creates a new assessment.
   * @param data The assessment data to be created.
   * @returns An Observable of the created assessment.
   * @throws An error if the request fails.
   */
  createAssessment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assessments`, data).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves an assessment by its ID.
   * @param id The ID of the assessment to retrieve.
   * @returns An Observable of the requested assessment.
   * @throws An error if the request fails.
   */
  getAssessment(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/assessments/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves all courses, using caching for improved performance.
   * @returns An Observable of an array of Course objects.
   * @throws An error if the request fails and there's no cached data.
   */
  getCourses(): Observable<Course[]> {
    return this.getCachedData<Course[]>('courses', `${this.apiUrl}/courses`);
  }

  /**
   * Retrieves details for a specific course, using caching for improved performance.
   * @param courseId The ID of the course to retrieve.
   * @returns An Observable of the course details.
   * @throws An error if the request fails and there's no cached data.
   */
  getCourseDetails(courseId: string): Observable<any> {
    return this.getCachedData<any>(`course_${courseId}`, `${this.apiUrl}/courses/${courseId}`);
  }

  /**
   * Retrieves the content for a specific course.
   * @param courseId The ID of the course to retrieve content for.
   * @returns An Observable of the course content.
   * @throws An error if the request fails.
   */
  getCourseContent(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/content`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Submits feedback for a specific course.
   * @param courseId The ID of the course to submit feedback for.
   * @param feedback The feedback data to submit.
   * @returns An Observable of the submission result.
   * @throws An error if the request fails.
   */
  submitCourseFeedback(courseId: string, feedback: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/feedback`, feedback).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves course recommendations.
   * @returns An Observable of course recommendations.
   * @throws An error if the request fails.
   */
  getCourseRecommendations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/course-recommendations`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves the progress for a specific course.
   * @param courseId The ID of the course to retrieve progress for.
   * @returns An Observable of the course progress.
   * @throws An error if the request fails.
   */
  getCourseProgress(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/progress`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Updates the progress for a specific course.
   * @param courseId The ID of the course to update progress for.
   * @param progressData The progress data to update.
   * @returns An Observable of the update result.
   * @throws An error if the request fails.
   */
  updateCourseProgress(courseId: string, progressData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/progress`, progressData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves the rating for a specific course.
   * @param courseId The ID of the course to retrieve the rating for.
   * @returns An Observable of the course rating.
   * @throws An error if the request fails.
   */
  getCourseRating(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/rating`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Submits a rating for a specific course.
   * @param courseId The ID of the course to submit a rating for.
   * @param rating The rating to submit.
   * @returns An Observable of the submission result.
   * @throws An error if the request fails.
   */
  submitCourseRating(courseId: string, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/rating`, { rating }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves the enrollment status for a specific course.
   * @param courseId The ID of the course to check enrollment status for.
   * @returns An Observable of the enrollment status.
   * @throws An error if the request fails.
   */
  getEnrollmentStatus(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/enrollment`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Enrolls the user in a specific course.
   * @param courseId The ID of the course to enroll in.
   * @returns An Observable of the enrollment result.
   * @throws An error if the request fails.
   */
  enrollCourse(courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/enroll`, {}).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Unenrolls the user from a specific course.
   * @param courseId The ID of the course to unenroll from.
   * @returns An Observable of the unenrollment result.
   * @throws An error if the request fails.
   */
  unenrollCourse(courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/unenroll`, {}).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves forum posts for a specific course.
   * @param courseId The ID of the course to retrieve forum posts for.
   * @returns An Observable of the forum posts.
   * @throws An error if the request fails.
   */
  getForumPosts(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/forum`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Creates a new forum post for a specific course.
   * @param courseId The ID of the course to create a forum post for.
   * @param post The forum post data to create.
   * @returns An Observable of the created forum post.
   * @throws An error if the request fails.
   */
  createForumPost(courseId: string, post: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/forum`, post).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves the user's profile.
   * @returns An Observable of the User object.
   * @throws An error if the request fails.
   */
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/profile`, { headers: this.getHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Updates the user's profile.
   * @param profileData The profile data to update.
   * @returns An Observable of the update result.
   * @throws An error if the request fails.
   */
  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user-profile`, profileData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves the courses the user is enrolled in.
   * @returns An Observable of an array of Course objects.
   * @throws An error if the request fails.
   */
  getEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/enrolled`, { headers: this.getHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves course statistics.
   * @returns An Observable of CourseStats.
   * @throws An error if the request fails.
   */
  getCourseStats(): Observable<CourseStats> {
    return this.http.get<CourseStats>(`${this.apiUrl}/courses/stats`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves assessment statistics.
   * @returns An Observable of AssessmentStats.
   * @throws An error if the request fails.
   */
  getAssessmentStats(): Observable<AssessmentStats> {
    return this.http.get<AssessmentStats>(`${this.apiUrl}/assessments/stats`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves the user's recent activities.
   * @returns An Observable of an array of Activity objects.
   * @throws An error if the request fails.
   */
  getRecentActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/user/activities`, { headers: this.getHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Uploads a new profile picture for the user.
   * @param file The image file to upload.
   * @returns An Observable of the upload result.
   * @throws An error if the request fails.
   */
  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.post(`${this.apiUrl}/users/profile-picture`, formData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Deletes the user's current profile picture.
   * @returns An Observable of the deletion result.
   * @throws An error if the request fails.
   */
  deleteProfilePicture(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/profile-picture`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Retrieves the authorization headers for authenticated requests.
   * @returns HttpHeaders with the authorization token.
   * @private
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('No token found. User might not be logged in.');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Retrieves cached data if available, otherwise fetches from the API and caches the result.
   * @param cacheKey The key to use for caching.
   * @param url The URL to fetch data from if not cached.
   * @returns An Observable of the requested data.
   * @private
   */
  private getCachedData<T>(cacheKey: string, url: string): Observable<T> {
    const cachedData = this.cacheService.get(cacheKey);
    if (cachedData) {
      return of(cachedData as T);
    }

    return this.http.get<T>(url).pipe(
      tap(data => this.cacheService.set(cacheKey, data)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Handles errors from HTTP requests.
   * @param error The error object.
   * @returns An Observable that errors with a user-friendly error message.
   * @private
   */
  private handleError(error: any): Observable<never> {
    this.errorHandler.handleError(error, 'API.ERROR');
    throw error;
  }
}