import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-details',
  template: `
    <div class="course-details" *ngIf="course">
      <h2>{{ course.title }}</h2>
      <p>{{ course.description }}</p>
      <div class="course-rating">
        <h3>{{ 'COURSES.AVERAGE_RATING' | translate }}: {{ course.averageRating | number:'1.1-1' }}/5</h3>
        <p>{{ 'COURSES.TOTAL_REVIEWS' | translate }}: {{ course.totalReviews }}</p>
      </div>
      <h3>{{ 'COURSES.LESSONS' | translate }}</h3>
      <ul>
        <li *ngFor="let lesson of course.lessons">
          {{ lesson.title }}
        </li>
      </ul>
      <button (click)="enrollInCourse()" *ngIf="!isEnrolled">{{ 'COURSES.ENROLL' | translate }}</button>
      <app-course-reviews [courseId]="course._id"></app-course-reviews>
      <app-course-feedback [courseId]="course._id"></app-course-feedback>
      <app-course-forum [courseId]="course._id"></app-course-forum>
      <app-social-share [courseId]="course._id" [courseTitle]="course.title"></app-social-share>
    </div>
  `
})
export class CourseDetailsComponent implements OnInit {
  course: any;
  isEnrolled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourseDetails(courseId);
    }
  }

  loadCourseDetails(courseId: string) {
    this.courseService.getCourseById(courseId).subscribe(
      data => {
        this.course = data;
        this.checkEnrollmentStatus();
      },
      error => console.error('Error fetching course details:', error)
    );
  }

  checkEnrollmentStatus() {
    // Implement this method to check if the user is enrolled in the course
    // You might need to add a method in the CourseService to check this
  }

  enrollInCourse() {
    if (this.course) {
      this.courseService.enrollInCourse(this.course._id).subscribe(
        () => {
          this.isEnrolled = true;
          // Show a success message
        },
        error => console.error('Error enrolling in course:', error)
      );
    }
  }
}