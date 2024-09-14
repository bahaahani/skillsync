import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-course-search',
  template: `
    <div class="course-search">
      <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
        <mat-form-field>
          <input matInput formControlName="keyword" [placeholder]="'COURSES.SEARCH_PLACEHOLDER' | translate">
        </mat-form-field>
        <mat-form-field>
          <mat-select formControlName="category" [placeholder]="'COURSES.CATEGORY' | translate">
            <mat-option value="">{{ 'COURSES.ALL_CATEGORIES' | translate }}</mat-option>
            <mat-option *ngFor="let category of categories" [value]="category">{{ category }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-select formControlName="difficulty" [placeholder]="'COURSES.DIFFICULTY' | translate">
            <mat-option value="">{{ 'COURSES.ALL_DIFFICULTIES' | translate }}</mat-option>
            <mat-option value="beginner">{{ 'COURSES.BEGINNER' | translate }}</mat-option>
            <mat-option value="intermediate">{{ 'COURSES.INTERMEDIATE' | translate }}</mat-option>
            <mat-option value="advanced">{{ 'COURSES.ADVANCED' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-select formControlName="duration" [placeholder]="'COURSES.DURATION' | translate">
            <mat-option value="">{{ 'COURSES.ALL_DURATIONS' | translate }}</mat-option>
            <mat-option value="short">{{ 'COURSES.SHORT' | translate }}</mat-option>
            <mat-option value="medium">{{ 'COURSES.MEDIUM' | translate }}</mat-option>
            <mat-option value="long">{{ 'COURSES.LONG' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">{{ 'COURSES.SEARCH' | translate }}</button>
      </form>
      <div *ngIf="searchResults.length > 0" class="search-results">
        <h3>{{ 'COURSES.SEARCH_RESULTS' | translate }}</h3>
        <div *ngFor="let course of searchResults" class="course-card">
          <h4>{{ course.title }}</h4>
          <p>{{ course.description }}</p>
          <p>{{ 'COURSES.CATEGORY' | translate }}: {{ course.category }}</p>
          <p>{{ 'COURSES.DIFFICULTY' | translate }}: {{ course.difficulty }}</p>
          <p>{{ 'COURSES.DURATION' | translate }}: {{ course.duration }}</p>
          <a [routerLink]="['/courses', course._id]">{{ 'COURSES.VIEW_DETAILS' | translate }}</a>
        </div>
      </div>
    </div>
  `
})
export class CourseSearchComponent implements OnInit {
  searchForm: FormGroup;
  categories: string[] = [];
  searchResults: any[] = [];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {
    this.searchForm = this.fb.group({
      keyword: [''],
      category: [''],
      difficulty: [''],
      duration: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.courseService.getCategories().subscribe(
      data => this.categories = data,
      error => this.errorHandler.handleError(error, 'COURSES.CATEGORIES_LOAD_ERROR')
    );
  }

  onSearch() {
    this.courseService.searchCourses(this.searchForm.value).subscribe(
      data => this.searchResults = data,
      error => this.errorHandler.handleError(error, 'COURSES.SEARCH_ERROR')
    );
  }
}