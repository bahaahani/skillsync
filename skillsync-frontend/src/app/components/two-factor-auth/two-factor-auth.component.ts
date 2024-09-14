import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-two-factor-auth',
  template: `
    <div class="two-factor-auth">
      <h2>{{ 'TWO_FACTOR.TITLE' | translate }}</h2>
      <p *ngIf="is2FAEnabled">{{ 'TWO_FACTOR.ENABLED' | translate }}</p>
      <p *ngIf="!is2FAEnabled">{{ 'TWO_FACTOR.DISABLED' | translate }}</p>
      <button *ngIf="!is2FAEnabled" (click)="enable2FA()">{{ 'TWO_FACTOR.ENABLE' | translate }}</button>
      <button *ngIf="is2FAEnabled" (click)="disable2FA()">{{ 'TWO_FACTOR.DISABLE' | translate }}</button>
      <div *ngIf="showVerification">
        <input [(ngModel)]="verificationToken" placeholder="{{ 'TWO_FACTOR.ENTER_TOKEN' | translate }}">
        <button (click)="verify2FA()">{{ 'TWO_FACTOR.VERIFY' | translate }}</button>
      </div>
    </div>
  `
})
export class TwoFactorAuthComponent implements OnInit {
  is2FAEnabled: boolean = false;
  showVerification: boolean = false;
  verificationToken: string = '';

  constructor(
    private authService: AuthService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.check2FAStatus();
  }

  check2FAStatus() {
    this.authService.is2FAEnabled().subscribe(
      status => this.is2FAEnabled = status,
      error => this.errorHandler.handleError(error, 'TWO_FACTOR.STATUS_ERROR')
    );
  }

  enable2FA() {
    this.authService.enable2FA().subscribe(
      () => {
        this.showVerification = true;
        this.errorHandler.showSuccessMessage('TWO_FACTOR.ENABLE_SUCCESS');
      },
      error => this.errorHandler.handleError(error, 'TWO_FACTOR.ENABLE_ERROR')
    );
  }

  disable2FA() {
    this.authService.disable2FA().subscribe(
      () => {
        this.is2FAEnabled = false;
        this.errorHandler.showSuccessMessage('TWO_FACTOR.DISABLE_SUCCESS');
      },
      error => this.errorHandler.handleError(error, 'TWO_FACTOR.DISABLE_ERROR')
    );
  }

  verify2FA() {
    this.authService.verify2FA(this.verificationToken).subscribe(
      () => {
        this.is2FAEnabled = true;
        this.showVerification = false;
        this.errorHandler.showSuccessMessage('TWO_FACTOR.VERIFY_SUCCESS');
      },
      error => this.errorHandler.handleError(error, 'TWO_FACTOR.VERIFY_ERROR')
    );
  }
}