import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlingService } from './error-handling.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = `${environment.apiUrl}/recommendations`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  getPersonalizedRecommendations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/personalized`).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'RECOMMENDATIONS.FETCH_ERROR');
        throw error;
      })
    );
  }

  getPopularCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/popular`).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'RECOMMENDATIONS.FETCH_ERROR');
        throw error;
      })
    );
  }

  getRecommendationsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}`).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'RECOMMENDATIONS.FETCH_ERROR');
        throw error;
      })
    );
  }
}