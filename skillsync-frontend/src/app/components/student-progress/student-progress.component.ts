import { Component, OnInit } from '@angular/core';
import { StudentProgressService } from '../../services/student-progress.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-student-progress',
  template: `
    <div class="student-progress">
      <h2>{{ 'PROGRESS.TITLE' | translate }}</h2>
      <div *ngFor="let course of courseProgress">
        <h3>{{ course.title }}</h3>
        <mat-progress-bar [value]="course.overallProgress"></mat-progress-bar>
        <div *ngFor="let module of course.modules">
          <p>{{ module.title }}: {{ module.progress }}%</p>
          <mat-progress-bar [value]="module.progress"></mat-progress-bar>
        </div>
      </div>
    </div>
  `
})
export class StudentProgressComponent implements OnInit {
  courseProgress: any[] = [];

  constructor(
    private studentProgressService: StudentProgressService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadOverallProgress();
  }

  loadOverallProgress() {
    this.studentProgressService.getOverallProgress().subscribe(
      progress => this.courseProgress = progress,
      error => this.errorHandler.handleError(error, 'PROGRESS.LOAD_ERROR')
    );
  }
}