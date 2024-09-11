import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { User, CourseStats, AssessmentStats, Activity } from '../../models/dashboard.model';
import { Chart } from 'chart.js/auto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  enrolledCourses: Course[] = [];
  recommendedCourses: Course[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  user: User | null = null;
  courseStats: CourseStats | null = null;
  assessmentStats: AssessmentStats | null = null;
  recentActivities: Activity[] = [];

  @ViewChild('skillProgressChart') skillProgressChart!: ElementRef;
  @ViewChild('courseCompletionChart') courseCompletionChart!: ElementRef;

  constructor(
    private apiService: ApiService,
    private courseService: CourseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.error = null;

    Promise.all([
      this.apiService.getEnrolledCourses().toPromise(),
      this.apiService.getUserProfile().toPromise(),
      this.apiService.getCourseStats().toPromise(),
      this.apiService.getAssessmentStats().toPromise(),
      this.apiService.getRecentActivities().toPromise(),
      this.courseService.getRecommendedCourses().toPromise()
    ]).then(([enrolledCourses, user, courseStats, assessmentStats, recentActivities, recommendedCourses]) => {
      this.enrolledCourses = enrolledCourses || [];
      this.user = user || null;
      this.courseStats = courseStats || null;
      this.assessmentStats = assessmentStats || null;
      this.recentActivities = recentActivities || [];
      this.recommendedCourses = recommendedCourses || [];
      this.isLoading = false;
      this.renderCharts();
    }).catch(error => {
      console.error('Error fetching dashboard data:', error);
      this.error = 'Failed to load dashboard data. Please try again later.';
      this.isLoading = false;
      this.showErrorMessage(this.error);
    });
  }

  renderCharts() {
    if (this.user && this.courseStats) {
      this.renderSkillProgressChart();
      this.renderCourseCompletionChart();
    }
  }

  renderSkillProgressChart() {
    if (!this.user || !this.skillProgressChart) return;

    const ctx = this.skillProgressChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.user.skillsAcquired,
        datasets: [{
          label: 'Skill Progress',
          data: this.user.skillsAcquired.map(() => Math.random() * 100),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  renderCourseCompletionChart() {
    if (!this.courseStats || !this.courseCompletionChart) return;

    const ctx = this.courseCompletionChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress'],
        datasets: [{
          data: [this.courseStats.completed, this.enrolledCourses.length - this.courseStats.completed],
          backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 206, 86, 0.8)']
        }]
      }
    });
  }

  refreshDashboard() {
    this.loadDashboardData();
    this.showSuccessMessage('Dashboard data refreshed');
  }

  enrollCourse(courseId: string) {
    this.courseService.joinCourse(courseId).subscribe({
      next: () => {
        this.showSuccessMessage('Successfully enrolled in the course');
        this.loadDashboardData(); // Refresh dashboard data after enrollment
      },
      error: (error) => {
        console.error('Error enrolling in course:', error);
        this.showErrorMessage('Error enrolling in course. Please try again.');
      }
    });
  }

  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}