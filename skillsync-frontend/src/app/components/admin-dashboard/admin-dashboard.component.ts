import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { OverviewStats, UserGrowth, CourseEnrollment, CompletionRate, CourseEngagement, RevenueStats } from '../../models/analytics.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  overviewStats: OverviewStats | null = null;
  userGrowth: UserGrowth[] = [];
  courseEnrollments: CourseEnrollment[] = [];
  completionRates: CompletionRate[] = [];
  courseEngagement: CourseEngagement[] = [];
  revenueStats: RevenueStats | null = null;
  isLoading: boolean = false;
  selectedPeriod: string = 'week';

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.getOverviewStats();
    this.getUserGrowth();
    this.getCourseEnrollments();
    this.getCourseCompletionRates();
    this.getCourseEngagement();
    this.getRevenueStats();
  }

  onPeriodChange(): void {
    this.loadDashboardData();
  }

  loadAllAnalytics(): void {
    this.loadDashboardData();
  }

  getOverviewStats(): void {
    this.analyticsService.getOverallStats().subscribe({
      next: (data: OverviewStats) => {
        this.overviewStats = data;
      },
      error: (error: any) => {
        console.error('Error fetching overview stats:', error);
      }
    });
  }

  getUserGrowth(): void {
    this.analyticsService.getUserGrowthStats().subscribe({
      next: (data: UserGrowth[]) => {
        this.userGrowth = data;
      },
      error: (error: any) => {
        console.error('Error fetching user growth:', error);
      }
    });
  }

  getCourseEnrollments(): void {
    this.analyticsService.getEnrollmentStats().subscribe({
      next: (data: CourseEnrollment[]) => {
        this.courseEnrollments = data;
      },
      error: (error: any) => {
        console.error('Error fetching course enrollments:', error);
      }
    });
  }

  getCourseCompletionRates(): void {
    this.analyticsService.getCompletionRates().subscribe({
      next: (data: CompletionRate[]) => {
        this.completionRates = data;
      },
      error: (error: any) => {
        console.error('Error fetching course completion rates:', error);
      }
    });
  }

  getCourseEngagement(): void {
    this.analyticsService.getCourseEngagement().subscribe({
      next: (data: CourseEngagement[]) => {
        this.courseEngagement = data;
      },
      error: (error: any) => {
        console.error('Error fetching course engagement:', error);
      }
    });
  }

  getRevenueStats(): void {
    this.analyticsService.getRevenueStats().subscribe({
      next: (data: RevenueStats) => {
        this.revenueStats = data;
      },
      error: (error: any) => {
        console.error('Error fetching revenue stats:', error);
      }
    });
  }
}