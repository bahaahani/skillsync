import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { CourseService } from '../../services/course.service';
import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  user: any;
  totalCourses: number = 0;
  completedCourses: number = 0;
  averageScore: number = 0;

  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private assessmentService: AssessmentService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadCourseStats();
    this.loadAssessmentStats();
  }

  loadUserData() {
    this.userService.getCurrentUser().subscribe(
      (user) => {
        this.user = user;
      },
      (error) => console.error('Error loading user data', error)
    );
  }

  loadCourseStats() {
    this.courseService.getCourseStats().subscribe(
      (stats) => {
        this.totalCourses = stats.totalCourses;
        this.completedCourses = stats.completedCourses;
      },
      (error) => console.error('Error loading course stats', error)
    );
  }

  loadAssessmentStats() {
    this.assessmentService.getAssessmentStats().subscribe(
      (stats: any) => {
        this.averageScore = stats.averageScore;
      },
      (error: any) => console.error('Error loading assessment stats', error)
    );
  }
}