import { Component, OnInit } from '@angular/core';
import { GamificationService } from '../../services/gamification.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-user-badges',
  template: `
    <div class="user-badges">
      <h2>{{ 'BADGES.YOUR_BADGES' | translate }}</h2>
      <div class="badge-list">
        <div *ngFor="let badge of userBadges" class="badge-item">
          <img [src]="badge.imageUrl" [alt]="badge.name">
          <p>{{ badge.name }}</p>
        </div>
      </div>
      <h3>{{ 'BADGES.AVAILABLE_BADGES' | translate }}</h3>
      <div class="badge-list">
        <div *ngFor="let badge of availableBadges" class="badge-item">
          <img [src]="badge.imageUrl" [alt]="badge.name" class="greyscale">
          <p>{{ badge.name }}</p>
          <p>{{ badge.description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge-list { display: flex; flex-wrap: wrap; }
    .badge-item { margin: 10px; text-align: center; }
    .greyscale { filter: grayscale(100%); }
  `]
})
export class UserBadgesComponent implements OnInit {
  userBadges: any[] = [];
  availableBadges: any[] = [];

  constructor(
    private gamificationService: GamificationService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadUserBadges();
    this.loadAvailableBadges();
  }

  loadUserBadges() {
    this.gamificationService.getUserBadges().subscribe(
      badges => this.userBadges = badges,
      error => this.errorHandler.handleError(error, 'BADGES.LOAD_ERROR')
    );
  }

  loadAvailableBadges() {
    this.gamificationService.getAvailableBadges().subscribe(
      badges => this.availableBadges = badges,
      error => this.errorHandler.handleError(error, 'BADGES.AVAILABLE_LOAD_ERROR')
    );
  }
}