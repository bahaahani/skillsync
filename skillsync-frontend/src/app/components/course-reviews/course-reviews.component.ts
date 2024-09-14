import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-reviews',
  template: `
    <div class="course-reviews">
      <h3>{{ 'COURSES.REVIEWS' | translate }}</h3>
      <div *ngFor="let review of reviews" class="review">
        <p>{{ review.content }}</p>
        <p>{{ 'COURSES.RATING' | translate }}: {{ review.rating }}/5</p>
        <p>{{ 'COURSES.BY' | translate }}: {{ review.userName }}</p>
      </div>
      <form [formGroup]="reviewForm" (ngSubmit)="submitReview()">
        <mat-form-field>
          <textarea matInput formControlName="content" placeholder="{{ 'COURSES.WRITE_REVIEW' | translate }}"></textarea>
        </mat-form-field>
        <mat-form-field>
          <mat-select formControlName="rating" placeholder="{{ 'COURSES.SELECT_RATING' | translate }}">
            <mat-option *ngFor="let rating of [1,2,3,4,5]" [value]="rating">
              {{rating}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="reviewForm.invalid">
          {{ 'COURSES.SUBMIT_REVIEW' | translate }}
        </button>
      </form>
    </div>
  `
})
export class CourseReviewsComponent implements OnInit {
  @Input() courseId: string;
  reviews: any[] = [];
  reviewForm: FormGroup;

  constructor(
    private courseService: CourseService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      content: ['', Validators.required],
      rating: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.courseService.getCourseReviews(this.courseId).subscribe(
      data => this.reviews = data,
      error => console.error('Error fetching reviews:', error)
    );
  }

  submitReview() {
    if (this.reviewForm.valid) {
      this.courseService.addCourseReview(this.courseId, this.reviewForm.value).subscribe(
        () => {
          this.loadReviews();
          this.reviewForm.reset();
        },
        error => console.error('Error submitting review:', error)
      );
    }
  }
}