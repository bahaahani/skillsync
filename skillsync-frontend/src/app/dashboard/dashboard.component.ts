import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

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

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.loadEnrolledCourses();
      this.loadRecommendedCourses();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadEnrolledCourses() {
    this.isLoading = true;
    this.courseService.getEnrolledCourses().pipe(
      catchError(error => {
        console.error('Error fetching enrolled courses:', error);
        this.error = 'Failed to load enrolled courses. Please try again later.';
        return of([]);
      })
    ).subscribe(courses => {
      this.enrolledCourses = courses;
      this.isLoading = false;
    });
  }

  loadRecommendedCourses() {
    this.courseService.getRecommendedCourses().pipe(
      catchError(error => {
        console.error('Error fetching recommended courses:', error);
        this.error = 'Failed to load recommended courses. Please try again later.';
        return of([]);
      })
    ).subscribe(courses => {
      this.recommendedCourses = courses;
    });
  }

  navigateToCourse(courseId: string) {
    this.router.navigate(['/course', courseId]);
  }
}
