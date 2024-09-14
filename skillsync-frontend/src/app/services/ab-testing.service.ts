import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AbTestingService {
  private apiUrl = `${environment.apiUrl}/ab-testing`;

  constructor(private http: HttpClient) {}

  getVariant(testName: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/variant/${testName}`);
  }

  trackConversion(testName: string, variant: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/conversion`, { testName, variant });
  }
}