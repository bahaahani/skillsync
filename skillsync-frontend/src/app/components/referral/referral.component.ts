import { Component, OnInit } from '@angular/core';
import { ReferralService } from '../../services/referral.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-referral',
  template: `
    <div class="referral-system">
      <h2>{{ 'REFERRAL.TITLE' | translate }}</h2>
      <button (click)="generateReferralCode()">{{ 'REFERRAL.GENERATE_CODE' | translate }}</button>
      <p *ngIf="referralCode">{{ 'REFERRAL.YOUR_CODE' | translate }}: {{ referralCode }}</p>
      <div>
        <h3>{{ 'REFERRAL.APPLY_CODE' | translate }}</h3>
        <input [(ngModel)]="codeToApply" placeholder="{{ 'REFERRAL.ENTER_CODE' | translate }}">
        <button (click)="applyReferralCode()">{{ 'REFERRAL.APPLY' | translate }}</button>
      </div>
      <div *ngIf="referralStats">
        <h3>{{ 'REFERRAL.YOUR_STATS' | translate }}</h3>
        <p>{{ 'REFERRAL.TOTAL_REFERRALS' | translate }}: {{ referralStats.totalReferrals }}</p>
        <p>{{ 'REFERRAL.SUCCESSFUL_REFERRALS' | translate }}: {{ referralStats.successfulReferrals }}</p>
      </div>
    </div>
  `
})
export class ReferralComponent implements OnInit {
  referralCode: string;
  codeToApply: string;
  referralStats: any;

  constructor(
    private referralService: ReferralService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadReferralStats();
  }

  generateReferralCode() {
    this.referralService.generateReferralCode().subscribe(
      code => this.referralCode = code,
      error => this.errorHandler.handleError(error, 'REFERRAL.GENERATE_ERROR')
    );
  }

  applyReferralCode() {
    if (this.codeToApply) {
      this.referralService.applyReferralCode(this.codeToApply).subscribe(
        () => {
          this.errorHandler.showSuccessMessage('REFERRAL.APPLY_SUCCESS');
          this.codeToApply = '';
        },
        error => this.errorHandler.handleError(error, 'REFERRAL.APPLY_ERROR')
      );
    }
  }

  loadReferralStats() {
    this.referralService.getReferralStats().subscribe(
      stats => this.referralStats = stats,
      error => this.errorHandler.handleError(error, 'REFERRAL.STATS_LOAD_ERROR')
    );
  }
}