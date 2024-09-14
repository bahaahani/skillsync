import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-user-dashboard',
  template: `
    <div class="user-dashboard">
      <h2>{{ 'DASHBOARD.TITLE' | translate }}</h2>
      
      <section class="overall-progress">
        <h3>{{ 'DASHBOARD.OVERALL_PROGRESS' | translate }}</h3>
        <mat-progress-bar mode="determinate" [value]="overallProgress"></mat-progress-bar>
        <p>{{ overallProgress }}% {{ 'DASHBOARD.COMPLETE' | translate }}</p>
      </section>

      <section class="enrolled-courses">
        <h3>{{ 'DASHBOARD.ENROLLED_COURSES' | translate }}</h3>
        <div *ngFor="let course of enrolledCourses" class="course-progress-card">
          <h4>{{ course.title }}</h4>
          <mat-progress-bar mode="determinate" [value]="course.progress"></mat-progress-bar>
          <p>{{ course.progress }}% {{ 'DASHBOARD.COMPLETE' | translate }}</p>
          <a [routerLink]="['/courses', course._id]">{{ 'COURSES.CONTINUE' | translate }}</a>
        </div>
      </section>

      <section class="upcoming-deadlines">
        <h3>{{ 'DASHBOARD.UPCOMING_DEADLINES' | translate }}</h3>
        <ul>
          <li *ngFor="let deadline of upcomingDeadlines">
            <span>{{ deadline.courseName }}</span>
            <span>{{ deadline.taskName }}</span>
            <span>{{ deadline.date | date }}</span>
          </li>
        </ul>
      </section>

      <section class="recent-activities">
        <h3>{{ 'DASHBOARD.RECENT_ACTIVITIES' | translate }}</h3>
        <ul>
          <li *ngFor="let activity of recentActivities">
            {{ activity.description }}
            <span>{{ activity.date | date }}</span>
          </li>
        </ul>
      </section>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  enrolledCourses: any[] = [];
  upcomingDeadlines: any[] = [];
  recentActivities: any[] = [];
  overallProgress: number = 0;

  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadEnrolledCourses();
    this.loadUpcomingDeadlines();
    this.loadRecentActivities();
  }

  loadEnrolledCourses() {
    this.courseService.getEnrolledCourses().subscribe(
      data => {
        this.enrolledCourses = data;
        this.calculateOverallProgress();
      },
      error => this.errorHandler.handleError(error, 'DASHBOARD.ENROLLED_COURSES_LOAD_ERROR')
    );
  }

  loadUpcomingDeadlines() {
    this.courseService.getUpcomingDeadlines().subscribe(
      data => this.upcomingDeadlines = data,
      error => this.errorHandler.handleError(error, 'DASHBOARD.DEADLINES_LOAD_ERROR')
    );
  }

  loadRecentActivities() {
    this.courseService.getRecentActivities().subscribe(
      data => this.recentActivities = data,
      error => this.errorHandler.handleError(error, 'DASHBOARD.ACTIVITIES_LOAD_ERROR')
    );
  }

  calculateOverallProgress() {
    if (this.enrolledCourses.length === 0) {
      this.overallProgress = 0;
    } else {
      const totalProgress = this.enrolledCourses.reduce((sum, course) => sum + course.progress, 0);
      this.overallProgress = Math.round(totalProgress / this.enrolledCourses.length);
    }
  }
}