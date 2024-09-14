import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  private apiUrl = `${environment.apiUrl}/gamification`;

  constructor(private http: HttpClient) {}

  getUserPoints(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/points`);
  }

  getUserBadges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/badges`);
  }

  awardPoints(points: number, reason: string): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/award-points`, { points, reason });
  }

  awardBadge(badgeId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/award-badge`, { badgeId });
  }

  getAvailableBadges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available-badges`);
  }

  getLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaderboard`);
  }
}