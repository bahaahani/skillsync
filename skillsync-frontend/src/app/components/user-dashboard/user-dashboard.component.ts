import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  enrolledCourses: any[] = [];
  upcomingDeadlines: any[] = [];
  recentActivities: any[] = [];
  overallProgress: number = 0;

  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) { }

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