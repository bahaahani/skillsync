import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityAuditService {
  private apiUrl = `${environment.apiUrl}/security-audit`;

  constructor(private http: HttpClient) {}

  runAudit(): Observable<any> {
    return this.http.post(`${this.apiUrl}/run`, {});
  }

  getLastAuditResults(): Observable<any> {
    return this.http.get(`${this.apiUrl}/results`);
  }

  fixVulnerability(vulnerabilityId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/fix/${vulnerabilityId}`, {});
  }
}