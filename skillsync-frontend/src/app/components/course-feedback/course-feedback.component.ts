import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-course-feedback',
  template: `
    <div class="course-feedback">
      <h3>{{ 'COURSES.FEEDBACK' | translate }}</h3>
      <form [formGroup]="feedbackForm" (ngSubmit)="submitFeedback()">
        <mat-form-field>
          <textarea matInput formControlName="content" placeholder="{{ 'COURSES.WRITE_FEEDBACK' | translate }}"></textarea>
        </mat-form-field>
        <mat-form-field>
          <mat-select formControlName="rating" placeholder="{{ 'COURSES.SELECT_RATING' | translate }}">
            <mat-option *ngFor="let rating of [1,2,3,4,5]" [value]="rating">
              {{rating}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="feedbackForm.invalid">
          {{ 'COURSES.SUBMIT_FEEDBACK' | translate }}
        </button>
      </form>
    </div>
  `
})
export class CourseFeedbackComponent implements OnInit {
  @Input() courseId: string;
  feedbackForm: FormGroup;

  constructor(
    private courseService: CourseService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlingService
  ) {
    this.feedbackForm = this.fb.group({
      content: ['', Validators.required],
      rating: ['', Validators.required]
    });
  }

  ngOnInit() {}

  submitFeedback() {
    if (this.feedbackForm.valid) {
      this.courseService.addCourseFeedback(this.courseId, this.feedbackForm.value).subscribe(
        () => {
          this.errorHandler.showSuccessMessage('COURSES.FEEDBACK_SUBMITTED');
          this.feedbackForm.reset();
        },
        error => this.errorHandler.handleError(error, 'COURSES.FEEDBACK_SUBMIT_ERROR')
      );
    }
  }
}