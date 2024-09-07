import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [LeaderboardService]  // Add this line to provide the service
})
export class LeaderboardComponent implements OnInit {
  leaderboardEntries: any[] = [];

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.leaderboardService.getLeaderboard().subscribe(
      (entries) => {
        this.leaderboardEntries = entries;
      },
      (error) => console.error('Error loading leaderboard', error)
    );
  }
}