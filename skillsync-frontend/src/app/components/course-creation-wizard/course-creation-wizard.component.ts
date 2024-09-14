import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-course-creation-wizard',
  template: `
    <mat-horizontal-stepper [linear]="true" #stepper>
      <mat-step [stepControl]="basicInfoForm">
        <form [formGroup]="basicInfoForm">
          <ng-template matStepLabel>Basic Information</ng-template>
          <mat-form-field>
            <input matInput placeholder="Course Title" formControlName="title" required>
          </mat-form-field>
          <mat-form-field>
            <textarea matInput placeholder="Course Description" formControlName="description" required></textarea>
          </mat-form-field>
          <mat-form-field>
            <mat-select placeholder="Category" formControlName="category" required>
              <mat-option *ngFor="let category of categories" [value]="category">{{category}}</mat-option>
            </mat-select>
          </mat-form-field>
          <div>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="curriculumForm">
        <form [formGroup]="curriculumForm">
          <ng-template matStepLabel>Curriculum</ng-template>
          <div formArrayName="lessons">
            <div *ngFor="let lesson of curriculumForm.get('lessons').controls; let i = index">
              <div [formGroupName]="i">
                <mat-form-field>
                  <input matInput placeholder="Lesson Title" formControlName="title" required>
                </mat-form-field>
                <mat-form-field>
                  <textarea matInput placeholder="Lesson Content" formControlName="content" required></textarea>
                </mat-form-field>
              </div>
            </div>
          </div>
          <button mat-button (click)="addLesson()">Add Lesson</button>
          <div>
            <button mat-button matStepperPrevious>Back</button>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>

      <mat-step>
        <ng-template matStepLabel>Review and Submit</ng-template>
        <p>Review your course details and submit</p>
        <div>
          <button mat-button matStepperPrevious>Back</button>
          <button mat-button (click)="submitCourse()">Submit Course</button>
        </div>
      </mat-step>
    </mat-horizontal-stepper>
  `
})
export class CourseCreationWizardComponent {
  basicInfoForm: FormGroup;
  curriculumForm: FormGroup;
  categories: string[] = ['Programming', 'Design', 'Business', 'Marketing'];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {
    this.basicInfoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required]
    });

    this.curriculumForm = this.fb.group({
      lessons: this.fb.array([])
    });
  }

  addLesson() {
    const lessons = this.curriculumForm.get('lessons') as FormArray;
    lessons.push(this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    }));
  }

  submitCourse() {
    if (this.basicInfoForm.valid && this.curriculumForm.valid) {
      const courseData = {
        ...this.basicInfoForm.value,
        lessons: this.curriculumForm.get('lessons').value
      };

      this.courseService.createCourse(courseData).subscribe(
        () => {
          this.errorHandler.showSuccessMessage('COURSES.CREATE_SUCCESS');
          // Navigate to instructor dashboard or course list
        },
        error => this.errorHandler.handleError(error, 'COURSES.CREATE_ERROR')
      );
    }
  }
}