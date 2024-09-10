import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadCourseDetails();
  }

  loadCourseDetails() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.isLoading = true;
      this.courseService.getCourseById(courseId).subscribe({
        next: (course) => {
          this.course = course;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching course details:', error);
          this.showErrorMessage('Error fetching course details. Please try again later.');
          this.isLoading = false;
        }
      });
    }
  }

  enrollCourse() {
    if (this.course) {
      this.authService.enrollInCourse(this.course._id).subscribe({
        next: () => {
          this.course!.isEnrolled = true;
          this.showSuccessMessage('Successfully enrolled in the course');
        },
        error: (error) => {
          console.error('Error enrolling in course:', error);
          this.showErrorMessage('Error enrolling in the course. Please try again later.');
        }
      });
    }
  }

  updateLessonProgress(event: { courseId: string, lessonId: string, completed: boolean }) {
    this.courseService.updateLessonProgress(event.courseId, event.lessonId, event.completed).subscribe({
      next: (updatedCourse) => {
        this.course = updatedCourse;
        this.showSuccessMessage('Progress updated successfully');
      },
      error: (error) => {
        console.error('Error updating lesson progress:', error);
        this.showErrorMessage('Error updating progress. Please try again later.');
      }
    });
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