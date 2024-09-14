import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-enrolled-courses',
  template: `
    <div class="enrolled-courses">
      <h2>{{ 'COURSES.MY_COURSES' | translate }}</h2>
      <div *ngFor="let course of enrolledCourses" class="course-progress-card">
        <h3>{{ course.title }}</h3>
        <p>{{ 'COURSES.PROGRESS' | translate }}: {{ course.progress }}%</p>
        <mat-progress-bar mode="determinate" [value]="course.progress"></mat-progress-bar>
        <a [routerLink]="['/courses', course._id]">{{ 'COURSES.CONTINUE' | translate }}</a>
      </div>
    </div>
  `
})
export class EnrolledCoursesComponent implements OnInit {
  enrolledCourses: any[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses() {
    this.courseService.getEnrolledCourses().subscribe(
      data => this.enrolledCourses = data,
      error => console.error('Error fetching enrolled courses:', error)
    );
  }
}