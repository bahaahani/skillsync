import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Course, CourseReview } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-course-review',
  templateUrl: './course-review.component.html'
})
export class CourseReviewComponent implements OnInit {
  @Input() course!: Course;
  @Output() reviewAdded = new EventEmitter<CourseReview>();

  reviews: CourseReview[] = [];
  newReviewContent: string = '';
  newReviewRating: number = 0;
  currentUserId: string = '';
  pageSize: number = 5;
  pageIndex: number = 0;
  totalReviews: number = 0;
  sortBy: 'date' | 'rating' = 'date';

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {
    this.currentUserId = this.authService.getCurrentUserId() ?? '';
  }

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.courseService.getCourseReviews(this.course._id, this.pageIndex, this.pageSize, this.sortBy).subscribe({
      next: (data) => {
        this.reviews = data.reviews;
        this.totalReviews = data.totalCount;
      },
      error: (error) => console.error('Error loading reviews:', error)
    });
  }

  addReview() {
    if (this.newReviewContent && this.newReviewRating > 0) {
      const review = { content: this.newReviewContent, rating: this.newReviewRating };
      this.courseService.addCourseReview(this.course._id, review).subscribe({
        next: (newReview) => {
          this.reviews.unshift(newReview);
          this.newReviewContent = '';
          this.newReviewRating = 0;
          this.reviewAdded.emit(newReview);
        },
        error: (error) => console.error('Error adding review:', error)
      });
    }
  }

  editReview(review: CourseReview) {
    const updatedReview = { content: review.content, rating: review.rating };
    this.courseService.updateCourseReview(this.course._id, review._id, updatedReview).subscribe({
      next: (updatedReview) => {
        const index = this.reviews.findIndex(r => r._id === updatedReview._id);
        if (index !== -1) {
          this.reviews[index] = updatedReview;
        }
      },
      error: (error) => console.error('Error updating review:', error)
    });
  }

  deleteReview(reviewId: string) {
    this.courseService.deleteCourseReview(this.course._id, reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r._id !== reviewId);
      },
      error: (error) => console.error('Error deleting review:', error)
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReviews();
  }

  onSortChange() {
    this.pageIndex = 0;
    this.loadReviews();
  }

  canEditReview(review: CourseReview): boolean {
    return review.userId === this.currentUserId;
  }
}