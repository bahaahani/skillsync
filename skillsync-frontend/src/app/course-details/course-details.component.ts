import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { AuthService } from '../services/auth.service';
import { Course, CourseReview } from '../models/course.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  isLoading = true;
  isEnrolled = false;
  progress = 0;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourseDetails(courseId);
    }
  }

  loadCourseDetails(courseId: string) {
    this.isLoading = true;
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.isEnrolled = course.isEnrolled;
        this.loadCourseProgress(courseId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading course details:', error);
        this.showErrorMessage('Error loading course details. Please try again.');
        this.isLoading = false;
      }
    });
  }

  loadCourseProgress(courseId: string) {
    if (this.isEnrolled) {
      this.courseService.getCourseProgress(courseId).subscribe({
        next: (progress) => {
          this.progress = progress;
        },
        error: (error) => {
          console.error('Error loading course progress:', error);
        }
      });
    }
  }

  enrollCourse() {
    if (this.course) {
      this.courseService.joinCourse(this.course._id).subscribe({
        next: () => {
          this.isEnrolled = true;
          this.showSuccessMessage('Successfully enrolled in the course');
        },
        error: (error) => {
          console.error('Error enrolling in course:', error);
          this.showErrorMessage('Error enrolling in course. Please try again.');
        }
      });
    }
  }

  toggleWishlist() {
    if (this.course) {
      if (this.course.isWishlisted) {
        this.courseService.removeFromWishlist(this.course._id).subscribe({
          next: () => {
            this.course!.isWishlisted = false;
            this.showSuccessMessage('Course removed from wishlist');
          },
          error: (error) => {
            console.error('Error removing course from wishlist:', error);
            this.showErrorMessage('Error removing course from wishlist. Please try again.');
          }
        });
      } else {
        this.courseService.addToWishlist(this.course._id).subscribe({
          next: () => {
            this.course!.isWishlisted = true;
            this.showSuccessMessage('Course added to wishlist');
          },
          error: (error) => {
            console.error('Error adding course to wishlist:', error);
            this.showErrorMessage('Error adding course to wishlist. Please try again.');
          }
        });
      }
    }
  }

  onRatingChange(newRating: number) {
    if (this.course) {
      this.courseService.rateCourse(this.course._id, newRating).subscribe({
        next: (updatedCourse) => {
          this.course = updatedCourse;
          this.showSuccessMessage('Course rated successfully');
        },
        error: (error) => {
          console.error('Error rating course:', error);
          this.showErrorMessage('Error rating course. Please try again.');
        }
      });
    }
  }

  onReviewAdded(newReview: CourseReview) {
    if (this.course) {
      if (!this.course.reviews) {
        this.course.reviews = [];
      }
      this.course.reviews.unshift(newReview);
      this.updateCourseAverageRating();
    }
  }

  private updateCourseAverageRating() {
    if (this.course && this.course.reviews && this.course.reviews.length > 0) {
      const sum = this.course.reviews.reduce((total, review) => total + review.rating, 0);
      this.course.rating = sum / this.course.reviews.length;
    }
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}