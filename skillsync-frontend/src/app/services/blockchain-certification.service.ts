import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockchainCertificationService {
  private apiUrl = `${environment.apiUrl}/blockchain-certification`;

  constructor(private http: HttpClient) {}

  issueCertificate(userId: string, courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/issue`, { userId, courseId });
  }

  verifyCertificate(certificateId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify/${certificateId}`);
  }

  getUserCertificates(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getCertificateDetails(certificateId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/details/${certificateId}`);
  }
}