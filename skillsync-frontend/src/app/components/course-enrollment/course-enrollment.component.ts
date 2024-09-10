import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-enrollment',
  templateUrl: './course-enrollment.component.html'
})
export class CourseEnrollmentComponent implements OnInit {
  @Input() courseId!: string;
  isEnrolled: boolean = false;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.checkEnrollmentStatus();
  }

  checkEnrollmentStatus() {
    this.apiService.getEnrollmentStatus(this.courseId).subscribe(
      status => {
        this.isEnrolled = status.enrolled;
      },
      error => {
        console.error('Error checking enrollment status:', error);
      }
    );
  }

  enrollCourse() {
    this.apiService.enrollCourse(this.courseId).subscribe(
      response => {
        this.isEnrolled = true;
        this.snackBar.open('Successfully enrolled in the course!', 'Close', { duration: 3000 });
      },
      error => {
        console.error('Error enrolling in course:', error);
        this.snackBar.open('Failed to enroll in the course. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }

  unenrollCourse() {
    this.apiService.unenrollCourse(this.courseId).subscribe(
      response => {
        this.isEnrolled = false;
        this.snackBar.open('Successfully unenrolled from the course.', 'Close', { duration: 3000 });
      },
      error => {
        console.error('Error unenrolling from course:', error);
        this.snackBar.open('Failed to unenroll from the course. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }
}