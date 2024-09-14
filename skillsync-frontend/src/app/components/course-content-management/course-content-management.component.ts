import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-course-content-management',
  template: `
    <div class="course-content-management">
      <h2>{{ 'COURSES.CONTENT_MANAGEMENT' | translate }}</h2>
      <form [formGroup]="contentForm" (ngSubmit)="updateContent()">
        <mat-form-field>
          <mat-label>{{ 'COURSES.SELECT_COURSE' | translate }}</mat-label>
          <mat-select formControlName="courseId" (selectionChange)="loadCourseContent()">
            <mat-option *ngFor="let course of courses" [value]="course._id">
              {{ course.title }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ 'COURSES.CONTENT' | translate }}</mat-label>
          <textarea matInput formControlName="content" rows="10"></textarea>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="contentForm.invalid">
          {{ 'COURSES.UPDATE_CONTENT' | translate }}
        </button>
      </form>
    </div>
  `
})
export class CourseContentManagementComponent implements OnInit {
  contentForm: FormGroup;
  courses: any[] = [];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {
    this.contentForm = this.fb.group({
      courseId: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getInstructorCourses().subscribe(
      data => this.courses = data,
      error => this.errorHandler.handleError(error, 'COURSES.LOAD_ERROR')
    );
  }

  loadCourseContent() {
    const courseId = this.contentForm.get('courseId')?.value;
    if (courseId) {
      this.courseService.getCourseContent(courseId).subscribe(
        data => this.contentForm.patchValue({ content: data.content }),
        error => this.errorHandler.handleError(error, 'COURSES.CONTENT_LOAD_ERROR')
      );
    }
  }

  updateContent() {
    if (this.contentForm.valid) {
      const { courseId, content } = this.contentForm.value;
      this.courseService.updateCourseContent(courseId, content).subscribe(
        () => this.errorHandler.showSuccessMessage('COURSES.CONTENT_UPDATE_SUCCESS'),
        error => this.errorHandler.handleError(error, 'COURSES.CONTENT_UPDATE_ERROR')
      );
    }
  }
}