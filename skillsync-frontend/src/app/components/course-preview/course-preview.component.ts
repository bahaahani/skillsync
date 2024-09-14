import { Component, Input, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-course-preview',
  template: `
    <div *ngIf="previewData" class="course-preview">
      <h3>{{ previewData.title }}</h3>
      <p>{{ previewData.description }}</p>
      <video *ngIf="previewData.previewVideoUrl" controls>
        <source [src]="previewData.previewVideoUrl" type="video/mp4">
        {{ 'COURSES.VIDEO_NOT_SUPPORTED' | translate }}
      </video>
      <ul>
        <li *ngFor="let topic of previewData.topicsPreviews">{{ topic }}</li>
      </ul>
      <button (click)="enrollInCourse()">{{ 'COURSES.ENROLL' | translate }}</button>
    </div>
  `
})
export class CoursePreviewComponent implements OnInit {
  @Input() courseId: string;
  previewData: any;

  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadPreviewData();
  }

  loadPreviewData() {
    this.courseService.getCoursePreview(this.courseId).subscribe(
      data => this.previewData = data,
      error => this.errorHandler.handleError(error, 'COURSES.PREVIEW_LOAD_ERROR')
    );
  }

  enrollInCourse() {
    this.courseService.enrollInCourse(this.courseId).subscribe(
      () => {
        // Handle successful enrollment
        this.errorHandler.showSuccessMessage('COURSES.ENROLL_SUCCESS');
      },
      error => this.errorHandler.handleError(error, 'COURSES.ENROLL_ERROR')
    );
  }
}