import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReputationService {
  private apiUrl = `${environment.apiUrl}/reputation`;

  constructor(private http: HttpClient) {}

  getUserReputation(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user`);
  }

  getLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaderboard`);
  }

  awardReputationPoints(userId: string, points: number, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/award`, { userId, points, reason });
  }
}