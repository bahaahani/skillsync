import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarIntegrationService {
  private apiUrl = `${environment.apiUrl}/calendar`;

  constructor(private http: HttpClient) {}

  addToGoogleCalendar(eventDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/google`, eventDetails);
  }

  addToOutlookCalendar(eventDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/outlook`, eventDetails);
  }

  addToAppleCalendar(eventDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apple`, eventDetails);
  }
}