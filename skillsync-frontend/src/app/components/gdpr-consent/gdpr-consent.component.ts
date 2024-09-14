import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gdpr-consent',
  template: `
    <div class="gdpr-consent">
      <h2>{{ 'GDPR.CONSENT_TITLE' | translate }}</h2>
      <p>{{ 'GDPR.CONSENT_DESCRIPTION' | translate }}</p>
      <mat-checkbox [(ngModel)]="consentGiven" (change)="updateConsent()">
        {{ 'GDPR.CONSENT_CHECKBOX' | translate }}
      </mat-checkbox>
      <button mat-raised-button color="primary" (click)="requestDataDeletion()">
        {{ 'GDPR.REQUEST_DATA_DELETION' | translate }}
      </button>
    </div>
  `
})
export class GdprConsentComponent implements OnInit {
  consentGiven: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadConsentStatus();
  }

  loadConsentStatus() {
    this.authService.getGdprConsent().subscribe(
      consent => this.consentGiven = consent,
      error => console.error('Error loading GDPR consent status:', error)
    );
  }

  updateConsent() {
    this.authService.updateGdprConsent(this.consentGiven).subscribe(
      () => console.log('GDPR consent updated'),
      error => console.error('Error updating GDPR consent:', error)
    );
  }

  requestDataDeletion() {
    if (confirm('Are you sure you want to request deletion of all your data? This action cannot be undone.')) {
      this.authService.requestDataDeletion().subscribe(
        () => console.log('Data deletion request submitted'),
        error => console.error('Error submitting data deletion request:', error)
      );
    }
  }
}