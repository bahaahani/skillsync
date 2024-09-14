import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-payment',
  template: `
    <div class="payment">
      <h2>{{ 'PAYMENT.TITLE' | translate }}</h2>
      <div *ngFor="let method of paymentMethods">
        <button (click)="selectPaymentMethod(method)">
          {{ 'PAYMENT.METHOD.' + method.toUpperCase() | translate }}
        </button>
      </div>
      <div *ngIf="selectedMethod">
        <h3>{{ 'PAYMENT.SELECTED_METHOD' | translate }}: {{ selectedMethod }}</h3>
        <form (ngSubmit)="processPayment()">
          <!-- Add form fields based on the selected payment method -->
          <button type="submit">{{ 'PAYMENT.PROCESS' | translate }}</button>
        </form>
      </div>
    </div>
  `
})
export class PaymentComponent implements OnInit {
  paymentMethods: string[] = [];
  selectedMethod: string | null = null;

  constructor(
    private paymentService: PaymentService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadPaymentMethods();
  }

  loadPaymentMethods() {
    this.paymentService.getAvailablePaymentMethods().subscribe(
      methods => this.paymentMethods = methods,
      error => this.errorHandler.handleError(error, 'PAYMENT.LOAD_METHODS_ERROR')
    );
  }

  selectPaymentMethod(method: string) {
    this.selectedMethod = method;
  }

  processPayment() {
    if (!this.selectedMethod) return;

    // Implement payment processing logic here
    this.paymentService.initiatePayment(100, 'USD', this.selectedMethod).subscribe(
      response => {
        // Handle successful payment initiation
        console.log('Payment initiated:', response);
      },
      error => this.errorHandler.handleError(error, 'PAYMENT.PROCESS_ERROR')
    );
  }
}