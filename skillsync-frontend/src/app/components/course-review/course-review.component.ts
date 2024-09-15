import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-course-review',
  templateUrl: './course-review.component.html',
  styleUrls: ['./course-review.component.css']
})
export class CourseReviewComponent implements OnInit {
  @Input() courseId!: string;
  course: any;
  sortBy: string = 'date';
  reviewForm: FormGroup;
  reviews: any[] = [];
  pageSize = 10;
  pageIndex = 0;
  totalReviews = 0;
  newReviewRating = 0;
  newReviewContent = '';
  isLoading = false;
  errorMessage: string = '';
  showAddReview = false;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService
  ) {
    this.reviewForm = this.formBuilder.group({
      rating: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCourseDetails();
    this.loadReviews();
  }

  loadCourseDetails(): void {
    this.courseService.getCourseDetails(this.courseId).subscribe(
      (course) => {
        this.course = course;
      },
      (error) => {
        console.error('Error loading course details:', error);
      }
    );
  }

  loadReviews(): void {
    // Implement the logic to load reviews
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReviews();
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      // Implement the logic to submit a review
    }
  }

  onRatingChange(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  onSortChange(): void {
    this.loadReviews();
  }

  canEditReview(review: any): boolean {
    // Implement logic to check if the current user can edit the review
    return false; // Placeholder
  }

  editReview(review: any): void {
    // Implement edit review logic
  }

  deleteReview(reviewId: string): void {
    // Implement delete review logic
  }

  addReview(): void {
    if (this.reviewForm.valid) {
      // Implement add review logic
    }
  }
}