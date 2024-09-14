import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityAuditService {
  private apiUrl = `${environment.apiUrl}/accessibility`;

  constructor(private http: HttpClient) {}

  runAudit(): Observable<any> {
    return this.http.post(`${this.apiUrl}/audit`, {});
  }

  getAuditResults(): Observable<any> {
    return this.http.get(`${this.apiUrl}/audit-results`);
  }

  fixIssue(issueId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/fix-issue`, { issueId });
  }
}