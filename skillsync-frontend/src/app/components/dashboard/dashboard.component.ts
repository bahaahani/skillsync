import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Course } from '../../models/course.model';
import { Chart } from 'chart.js/auto';

interface User {
  name: string;
  skillsAcquired: string[];
}

interface CourseStats {
  completed: number;
}

interface AssessmentStats {
  averageScore: number;
}

interface Activity {
  title: string;
  description: string;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  enrolledCourses: Course[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  user: User | null = null;
  courseStats: CourseStats | null = null;
  assessmentStats: AssessmentStats | null = null;
  recentActivities: Activity[] = [];

  @ViewChild('skillProgressChart') skillProgressChart!: ElementRef;
  @ViewChild('courseCompletionChart') courseCompletionChart!: ElementRef;

  constructor(private apiService: ApiService) {}

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
      this.apiService.getRecentActivities().toPromise()
    ]).then(([enrolledCourses, user, courseStats, assessmentStats, recentActivities]) => {
      this.enrolledCourses = enrolledCourses;
      this.user = user;
      this.courseStats = courseStats;
      this.assessmentStats = assessmentStats;
      this.recentActivities = recentActivities;
      this.isLoading = false;
      this.renderCharts();
    }).catch(error => {
      console.error('Error fetching dashboard data:', error);
      this.error = 'Failed to load dashboard data. Please try again later.';
      this.isLoading = false;
    });
  }

  renderCharts() {
    this.renderSkillProgressChart();
    this.renderCourseCompletionChart();
  }

  renderSkillProgressChart() {
    const ctx = this.skillProgressChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.user?.skillsAcquired || [],
        datasets: [{
          label: 'Skill Progress',
          data: this.user?.skillsAcquired?.map(() => Math.random() * 100) || [],
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
    const ctx = this.courseCompletionChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress'],
        datasets: [{
          data: [this.courseStats?.completed || 0, this.enrolledCourses.length - (this.courseStats?.completed || 0)],
          backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 206, 86, 0.8)']
        }]
      }
    });
  }
}