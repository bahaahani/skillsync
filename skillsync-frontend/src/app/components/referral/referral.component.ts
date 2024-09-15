import { Component, OnInit } from '@angular/core';
import { ReferralService } from '../../services/referral.service';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {
  referralCode: string = '';
  codeToApply: string = '';
  referralStats: any;

  constructor(
    private referralService: ReferralService,
    private errorHandler: ErrorHandlingService,
    private translateService: TranslateService
  ) { }

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