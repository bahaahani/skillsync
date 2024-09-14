import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from '../../services/feedback.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-user-feedback',
  template: `
    <div class="user-feedback">
      <h2>{{ 'FEEDBACK.TITLE' | translate }}</h2>
      <form [formGroup]="feedbackForm" (ngSubmit)="submitFeedback()">
        <mat-form-field>
          <mat-label>{{ 'FEEDBACK.CATEGORY' | translate }}</mat-label>
          <mat-select formControlName="category">
            <mat-option value="bug">{{ 'FEEDBACK.BUG' | translate }}</mat-option>
            <mat-option value="feature">{{ 'FEEDBACK.FEATURE_REQUEST' | translate }}</mat-option>
            <mat-option value="improvement">{{ 'FEEDBACK.IMPROVEMENT' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <textarea matInput formControlName="message" placeholder="{{ 'FEEDBACK.MESSAGE' | translate }}"></textarea>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="feedbackForm.invalid">
          {{ 'FEEDBACK.SUBMIT' | translate }}
        </button>
      </form>
    </div>
  `
})
export class UserFeedbackComponent {
  feedbackForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private errorHandler: ErrorHandlingService
  ) {
    this.feedbackForm = this.fb.group({
      category: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  submitFeedback() {
    if (this.feedbackForm.valid) {
      this.feedbackService.submitFeedback(this.feedbackForm.value).subscribe(
        () => {
          this.errorHandler.showSuccessMessage('FEEDBACK.SUBMIT_SUCCESS');
          this.feedbackForm.reset();
        },
        error => this.errorHandler.handleError(error, 'FEEDBACK.SUBMIT_ERROR')
      );
    }
  }
}