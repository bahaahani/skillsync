import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-detailed-course-analytics',
  template: `
    <div class="detailed-course-analytics">
      <h2>{{ 'ANALYTICS.DETAILED_TITLE' | translate }}</h2>
      <canvas id="enrollmentTrendChart"></canvas>
      <canvas id="completionRateChart"></canvas>
      <canvas id="averageScoreChart"></canvas>
      <div class="student-progress-table">
        <!-- Add a table to display individual student progress -->
      </div>
    </div>
  `
})
export class DetailedCourseAnalyticsComponent implements OnInit {
  courseId: string;
  analyticsData: any;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.loadDetailedAnalytics();
  }

  loadDetailedAnalytics() {
    this.courseService.getDetailedAnalytics(this.courseId).subscribe(
      data => {
        this.analyticsData = data;
        this.createCharts();
      },
      error => this.errorHandler.handleError(error, 'ANALYTICS.LOAD_ERROR')
    );
  }

  createCharts() {
    this.createEnrollmentTrendChart();
    this.createCompletionRateChart();
    this.createAverageScoreChart();
  }

  createEnrollmentTrendChart() {
    new Chart('enrollmentTrendChart', {
      type: 'line',
      data: {
        labels: this.analyticsData.enrollmentTrend.labels,
        datasets: [{
          label: 'Enrollments',
          data: this.analyticsData.enrollmentTrend.data,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    });
  }

  createCompletionRateChart() {
    // Similar implementation to createEnrollmentTrendChart
  }

  createAverageScoreChart() {
    // Similar implementation to createEnrollmentTrendChart
  }
}