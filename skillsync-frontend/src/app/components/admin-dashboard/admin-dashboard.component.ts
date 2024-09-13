import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  overviewStats: any;
  userGrowth: any;
  courseEnrollments: any;
  courseCompletionRates: any;
  userEngagement: any;
  revenueStats: any;
  isLoading = false;
  selectedPeriod = 'month';

  constructor(
    private analyticsService: AnalyticsService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loadAllAnalytics();
  }

  loadAllAnalytics() {
    this.isLoading = true;
    this.loadOverviewStats();
    this.loadUserGrowth();
    this.loadCourseEnrollments();
    this.loadCourseCompletionRates();
    this.loadUserEngagement();
    this.loadRevenueStats();
  }

  loadOverviewStats() {
    this.analyticsService.getOverviewStats().subscribe({
      next: (data) => {
        this.overviewStats = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading overview stats:', error);
        this.isLoading = false;
      }
    });
  }

  loadUserGrowth() {
    this.analyticsService.getUserGrowth(this.selectedPeriod).subscribe({
      next: (data) => {
        this.userGrowth = data;
      },
      error: (error) => console.error('Error loading user growth:', error)
    });
  }

  loadCourseEnrollments() {
    this.analyticsService.getCourseEnrollments(this.selectedPeriod).subscribe({
      next: (data) => {
        this.courseEnrollments = data;
      },
      error: (error) => console.error('Error loading course enrollments:', error)
    });
  }

  loadCourseCompletionRates() {
    this.analyticsService.getCourseCompletionRates().subscribe({
      next: (data) => {
        this.courseCompletionRates = data;
      },
      error: (error) => console.error('Error loading course completion rates:', error)
    });
  }

  loadUserEngagement() {
    this.analyticsService.getUserEngagement(this.selectedPeriod).subscribe({
      next: (data) => {
        this.userEngagement = data;
      },
      error: (error) => console.error('Error loading user engagement:', error)
    });
  }

  loadRevenueStats() {
    this.analyticsService.getRevenueStats(this.selectedPeriod).subscribe({
      next: (data) => {
        this.revenueStats = data;
      },
      error: (error) => console.error('Error loading revenue stats:', error)
    });
  }

  onPeriodChange() {
    this.loadAllAnalytics();
  }
}