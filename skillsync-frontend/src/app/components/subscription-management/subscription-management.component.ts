import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-subscription-management',
  template: `
    <div class="subscription-management">
      <h2>{{ 'SUBSCRIPTION.TITLE' | translate }}</h2>
      <div *ngIf="currentSubscription">
        <p>{{ 'SUBSCRIPTION.CURRENT_PLAN' | translate }}: {{ currentSubscription.name }}</p>
        <p>{{ 'SUBSCRIPTION.EXPIRES_ON' | translate }}: {{ currentSubscription.expiresAt | date }}</p>
        <button (click)="cancelSubscription()">{{ 'SUBSCRIPTION.CANCEL' | translate }}</button>
      </div>
      <h3>{{ 'SUBSCRIPTION.AVAILABLE_PLANS' | translate }}</h3>
      <div *ngFor="let plan of subscriptionPlans" class="plan-card">
        <h4>{{ plan.name }}</h4>
        <p>{{ plan.description }}</p>
        <p>{{ plan.price | currency }}</p>
        <button (click)="subscribe(plan.id)">{{ 'SUBSCRIPTION.SUBSCRIBE' | translate }}</button>
      </div>
    </div>
  `
})
export class SubscriptionManagementComponent implements OnInit {
  currentSubscription: any;
  subscriptionPlans: any[] = [];

  constructor(
    private subscriptionService: SubscriptionService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadCurrentSubscription();
    this.loadSubscriptionPlans();
  }

  loadCurrentSubscription() {
    this.subscriptionService.getCurrentSubscription().subscribe(
      subscription => this.currentSubscription = subscription,
      error => this.errorHandler.handleError(error, 'SUBSCRIPTION.LOAD_CURRENT_ERROR')
    );
  }

  loadSubscriptionPlans() {
    this.subscriptionService.getSubscriptionPlans().subscribe(
      plans => this.subscriptionPlans = plans,
      error => this.errorHandler.handleError(error, 'SUBSCRIPTION.LOAD_PLANS_ERROR')
    );
  }

  subscribe(planId: string) {
    this.subscriptionService.subscribe(planId).subscribe(
      () => {
        this.errorHandler.showSuccessMessage('SUBSCRIPTION.SUBSCRIBE_SUCCESS');
        this.loadCurrentSubscription();
      },
      error => this.errorHandler.handleError(error, 'SUBSCRIPTION.SUBSCRIBE_ERROR')
    );
  }

  cancelSubscription() {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      this.subscriptionService.cancelSubscription().subscribe(
        () => {
          this.errorHandler.showSuccessMessage('SUBSCRIPTION.CANCEL_SUCCESS');
          this.currentSubscription = null;
        },
        error => this.errorHandler.handleError(error, 'SUBSCRIPTION.CANCEL_ERROR')
      );
    }
  }
}