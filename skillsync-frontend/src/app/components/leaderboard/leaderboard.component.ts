import { Component, OnInit } from '@angular/core';
import { GamificationService } from '../../services/gamification.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-leaderboard',
  template: `
    <div class="leaderboard">
      <h2>{{ 'LEADERBOARD.TITLE' | translate }}</h2>
      <table>
        <thead>
          <tr>
            <th>{{ 'LEADERBOARD.RANK' | translate }}</th>
            <th>{{ 'LEADERBOARD.USER' | translate }}</th>
            <th>{{ 'LEADERBOARD.POINTS' | translate }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let entry of leaderboard; let i = index">
            <td>{{ i + 1 }}</td>
            <td>{{ entry.username }}</td>
            <td>{{ entry.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
  `]
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any[] = [];

  constructor(
    private gamificationService: GamificationService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.gamificationService.getLeaderboard().subscribe(
      data => this.leaderboard = data,
      error => this.errorHandler.handleError(error, 'LEADERBOARD.LOAD_ERROR')
    );
  }
}