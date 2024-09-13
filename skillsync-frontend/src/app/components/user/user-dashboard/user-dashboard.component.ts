import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  user: any;
  enrolledCourses: any[] = [];
  recentActivities: any[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.loadUserDashboard();
  }

  loadUserDashboard() {
    this.isLoading = true;
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.loadEnrolledCourses();
        this.loadRecentActivities();
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.isLoading = false;
      }
    });
  }

  loadEnrolledCourses() {
    this.courseService.getEnrolledCourses().subscribe({
      next: (courses) => {
        this.enrolledCourses = courses;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading enrolled courses:', error);
        this.isLoading = false;
      }
    });
  }

  loadRecentActivities() {
    this.courseService.getRecentActivities().subscribe({
      next: (activities) => {
        this.recentActivities = activities;
      },
      error: (error) => {
        console.error('Error loading recent activities:', error);
      }
    });
  }
}