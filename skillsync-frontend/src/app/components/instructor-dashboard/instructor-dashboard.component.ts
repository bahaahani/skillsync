import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-instructor-dashboard',
  template: `
    <div class="instructor-dashboard">
      <h2>{{ 'INSTRUCTOR.DASHBOARD' | translate }}</h2>
      
      <section class="instructor-courses">
        <h3>{{ 'INSTRUCTOR.MY_COURSES' | translate }}</h3>
        <button mat-raised-button color="primary" (click)="openCreateCourseDialog()">
          {{ 'INSTRUCTOR.CREATE_COURSE' | translate }}
        </button>
        <div *ngFor="let course of instructorCourses" class="course-card">
          <h4>{{ course.title }}</h4>
          <p>{{ 'COURSES.ENROLLED_STUDENTS' | translate }}: {{ course.enrolledCount }}</p>
          <button mat-button (click)="editCourse(course._id)">{{ 'COMMON.EDIT' | translate }}</button>
          <button mat-button (click)="viewAnalytics(course._id)">{{ 'INSTRUCTOR.VIEW_ANALYTICS' | translate }}</button>
        </div>
      </section>

      <section class="student-progress">
        <h3>{{ 'INSTRUCTOR.STUDENT_PROGRESS' | translate }}</h3>
        <mat-form-field>
          <mat-label>{{ 'INSTRUCTOR.SELECT_COURSE' | translate }}</mat-label>
          <mat-select (selectionChange)="onCourseSelect($event.value)">
            <mat-option *ngFor="let course of instructorCourses" [value]="course._id">
              {{ course.title }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <div *ngIf="selectedCourseProgress">
          <!-- Display student progress for the selected course -->
        </div>
      </section>
    </div>
  `
})
export class InstructorDashboardComponent implements OnInit {
  instructorCourses: any[] = [];
  selectedCourseProgress: any;

  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadInstructorCourses();
  }

  loadInstructorCourses() {
    this.courseService.getInstructorCourses().subscribe(
      data => this.instructorCourses = data,
      error => this.errorHandler.handleError(error, 'INSTRUCTOR.COURSES_LOAD_ERROR')
    );
  }

  openCreateCourseDialog() {
    // Implement dialog to create a new course
  }

  editCourse(courseId: string) {
    // Implement course editing functionality
  }

  viewAnalytics(courseId: string) {
    // Implement analytics viewing functionality
  }

  onCourseSelect(courseId: string) {
    this.courseService.getCourseStudentProgress(courseId).subscribe(
      data => this.selectedCourseProgress = data,
      error => this.errorHandler.handleError(error, 'INSTRUCTOR.PROGRESS_LOAD_ERROR')
    );
  }
}