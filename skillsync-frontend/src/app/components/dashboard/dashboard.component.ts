import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('skillProgressChart') skillProgressChart!: ElementRef;
  @ViewChild('courseCompletionChart') courseCompletionChart!: ElementRef;

  user: any;
  courseStats: any;
  assessmentStats: any;
  recentActivities: any[] = [];
  skillProgress: any;
  courseCompletion: any;

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
    this.loadCourseCompletion();
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
      (progress) => {
        this.skillProgress = progress;
        this.createSkillProgressChart();
      },
      (error) => console.error('Error loading skill progress', error)
    );
  }

  loadCourseCompletion() {
    this.courseService.getCourseCompletion().subscribe(
      (completion) => {
        this.courseCompletion = completion;
        this.createCourseCompletionChart();
      },
      (error) => console.error('Error loading course completion', error)
    );
  }

  createSkillProgressChart() {
    const ctx = this.skillProgressChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.keys(this.skillProgress),
        datasets: [{
          label: 'Skill Progress',
          data: Object.values(this.skillProgress),
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

  createCourseCompletionChart() {
    const ctx = this.courseCompletionChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
          data: [
            this.courseCompletion.completed,
            this.courseCompletion.inProgress,
            this.courseCompletion.notStarted
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(255, 99, 132, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Course Completion'
          }
        }
      }
    });
  }
}