import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust this to your backend URL

  constructor(private http: HttpClient) { }

  getAssessment(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assessments/random`);
  }

  submitAssessment(answers: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/assessments/submit`, { answers });
  }

  getRecentAssessments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assessments/recent`);
  }

  getPersonalizedAssessments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assessments/personalized`);
  }

  getAllAssessments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assessments`);
  }

  getAssessmentHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assessments/history`);
  }

  getCertifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/certifications`);
  }

  createAssessment(assessmentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assessments`, assessmentData);
  }

  getAssessmentStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assessments/stats`);
  }
}