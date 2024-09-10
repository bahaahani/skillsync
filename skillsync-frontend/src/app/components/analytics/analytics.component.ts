import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-analytics',
  template: `
    <div *ngIf="analyticsData">
      <h2>Analytics</h2>
      <!-- Display analytics data here -->
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  analyticsData: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getAnalytics().subscribe(
      data => this.analyticsData = data,
      error => console.error('Error fetching analytics:', error)
    );
  }
}