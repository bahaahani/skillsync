import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  enrolledCourses: Course[] = [];
  recommendedCourses: Course[] = [];
  isLoading: boolean = false;

  constructor(private courseService: CourseService, private router: Router) { }

  ngOnInit() {
    this.loadEnrolledCourses();
    this.loadRecommendedCourses();
  }

  loadEnrolledCourses() {
    this.isLoading = true;
    this.courseService.getEnrolledCourses().subscribe({
      next: (courses: Course[]) => {
        this.enrolledCourses = courses;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching enrolled courses:', error);
        this.isLoading = false;
      }
    });
  }

  loadRecommendedCourses() {
    this.courseService.getRecommendedCourses().subscribe({
      next: (courses) => {
        this.recommendedCourses = courses;
      },
      error: (error) => {
        console.error('Error fetching recommended courses:', error);
      }
    });
  }

  navigateToCourse(courseId: string) {
    this.router.navigate(['/course', courseId]);
  }
}
