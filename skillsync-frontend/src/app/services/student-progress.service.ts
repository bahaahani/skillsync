import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentProgressService {
  private apiUrl = `${environment.apiUrl}/student-progress`;

  constructor(private http: HttpClient) {}

  getStudentProgress(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}`);
  }

  updateProgress(courseId: string, moduleId: string, progress: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/${moduleId}`, { progress });
  }

  getOverallProgress(): Observable<any> {
    return this.http.get(`${this.apiUrl}/overall`);
  }
}