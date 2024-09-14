import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocialSharingService {
  private apiUrl = `${environment.apiUrl}/social-sharing`;

  constructor(private http: HttpClient) {}

  shareAchievement(achievementId: string, platform: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/share`, { achievementId, platform });
  }

  getShareableLink(achievementId: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/link/${achievementId}`);
  }
}