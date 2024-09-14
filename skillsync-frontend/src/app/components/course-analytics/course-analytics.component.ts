import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-course-analytics',
  template: `
    <div class="course-analytics">
      <h2>{{ 'ANALYTICS.TITLE' | translate }}</h2>
      <canvas id="enrollmentChart"></canvas>
      <canvas id="completionRateChart"></canvas>
      <canvas id="averageRatingChart"></canvas>
    </div>
  `
})
export class CourseAnalyticsComponent implements OnInit {
  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.courseService.getCourseAnalytics().subscribe(
      data => {
        this.createEnrollmentChart(data.enrollmentData);
        this.createCompletionRateChart(data.completionRateData);
        this.createAverageRatingChart(data.averageRatingData);
      },
      error => this.errorHandler.handleError(error, 'ANALYTICS.LOAD_ERROR')
    );
  }

  createEnrollmentChart(data: any) {
    new Chart('enrollmentChart', {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Enrollments',
          data: data.values,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    });
  }

  createCompletionRateChart(data: any) {
    // Similar implementation to createEnrollmentChart
  }

  createAverageRatingChart(data: any) {
    // Similar implementation to createEnrollmentChart
  }
}