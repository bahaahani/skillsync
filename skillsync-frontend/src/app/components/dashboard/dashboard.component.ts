import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CourseService } from '../../services/course.service';
import { AssessmentService } from '../../services/assessment.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  courseStats: any;
  assessmentStats: any;
  recentActivities: any[] = [];
  skillProgressChart: Chart | null = null;

  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private assessmentService: AssessmentService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadCourseStats();
    this.loadAssessmentStats();
    this.loadRecentActivities();
    this.loadSkillProgress();
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
        this.courseStats = stats;
      },
      (error) => console.error('Error loading course stats', error)
    );
  }

  loadAssessmentStats() {
    this.assessmentService.getAssessmentStats().subscribe(
      (stats) => {
        this.assessmentStats = stats;
      },
      (error) => console.error('Error loading assessment stats', error)
    );
  }

  loadRecentActivities() {
    this.userService.getRecentActivities().subscribe(
      (activities) => {
        this.recentActivities = activities;
      },
      (error) => console.error('Error loading recent activities', error)
    );
  }

  loadSkillProgress() {
    this.userService.getSkillProgress().subscribe(
      (skillProgress) => {
        this.createSkillProgressChart(skillProgress);
      },
      (error) => console.error('Error loading skill progress', error)
    );
  }

  createSkillProgressChart(skillProgress: any) {
    const ctx = document.getElementById('skillProgressChart') as HTMLCanvasElement;
    this.skillProgressChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.keys(skillProgress),
        datasets: [{
          label: 'Skill Progress',
          data: Object.values(skillProgress),
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
}