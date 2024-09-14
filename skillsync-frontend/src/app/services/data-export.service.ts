import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataExportService {
  private apiUrl = `${environment.apiUrl}/data-export`;

  constructor(private http: HttpClient) {}

  exportUserData(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/user`, { responseType: 'blob' });
  }

  exportCourseData(courseId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/course/${courseId}`, { responseType: 'blob' });
  }
}