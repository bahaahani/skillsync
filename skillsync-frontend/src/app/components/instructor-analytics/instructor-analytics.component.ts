import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-instructor-analytics',
  template: `
    <div class="instructor-analytics">
      <h2>{{ 'INSTRUCTOR.ANALYTICS_DASHBOARD' | translate }}</h2>
      <div *ngIf="courseAnalytics">
        <h3>{{ 'INSTRUCTOR.COURSE_PERFORMANCE' | translate }}</h3>
        <canvas id="coursePerformanceChart"></canvas>
        <div *ngFor="let course of courseAnalytics">
          <h4>{{ course.title }}</h4>
          <p>{{ 'INSTRUCTOR.ENROLLED_STUDENTS' | translate }}: {{ course.enrolledCount }}</p>
          <p>{{ 'INSTRUCTOR.AVERAGE_RATING' | translate }}: {{ course.averageRating | number:'1.1-1' }}/5</p>
          <p>{{ 'INSTRUCTOR.COMPLETION_RATE' | translate }}: {{ course.completionRate | percent }}</p>
        </div>
      </div>
      <div *ngIf="studentProgress">
        <h3>{{ 'INSTRUCTOR.STUDENT_PROGRESS' | translate }}</h3>
        <canvas id="studentProgressChart"></canvas>
      </div>
    </div>
  `
})
export class InstructorAnalyticsComponent implements OnInit {
  courseAnalytics: any[];
  studentProgress: any[];

  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadCourseAnalytics();
    this.loadStudentProgress();
  }

  loadCourseAnalytics() {
    this.courseService.getInstructorCourseAnalytics().subscribe(
      data => {
        this.courseAnalytics = data;
        this.createCoursePerformanceChart();
      },
      error => this.errorHandler.handleError(error, 'INSTRUCTOR.ANALYTICS_LOAD_ERROR')
    );
  }

  loadStudentProgress() {
    this.courseService.getStudentProgress().subscribe(
      data => {
        this.studentProgress = data;
        this.createStudentProgressChart();
      },
      error => this.errorHandler.handleError(error, 'INSTRUCTOR.PROGRESS_LOAD_ERROR')
    );
  }

  createCoursePerformanceChart() {
    const ctx = document.getElementById('coursePerformanceChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.courseAnalytics.map(course => course.title),
        datasets: [ {
          label: 'Enrolled Students',
          data: this.courseAnalytics.map(course => course.enrolledCount),
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        } ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createStudentProgressChart() {
    const ctx = document.getElementById('studentProgressChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.studentProgress.map(student => student.name),
        datasets: [ {
          data: this.studentProgress.map(student => student.progress),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ]
        } ]
      },
      options: {
        responsive: true
      }
    });
  }
}