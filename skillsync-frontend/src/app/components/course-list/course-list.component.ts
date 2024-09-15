import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-course-list',
  template: `
    <h2 id="course-list-title">{{ 'COURSES.ALL_COURSES' | translate }}</h2>
    <cdk-virtual-scroll-viewport itemSize="50" class="course-list" aria-labelledby="course-list-title">
      <div *cdkVirtualFor="let course of courses; let i = index" class="course-card" [attr.aria-posinset]="i + 1" [attr.aria-setsize]="courses.length">
        <h3><a [routerLink]="['/courses', course._id]" [attr.aria-label]="'View details for ' + course.title">{{ course.title }}</a></h3>
        <p>{{ course.description }}</p>
        <p>{{ 'COURSES.ENROLLED_STUDENTS' | translate }}: {{ course.enrolledCount }}</p>
        <p *ngIf="isEnrolled(course._id)">{{ 'COURSES.ENROLLED' | translate }}</p>
        <button *ngIf="!isEnrolled(course._id)" 
                (click)="enrollInCourse(course._id)" 
                [attr.aria-label]="'Enroll in ' + course.title"
                [attr.tabindex]="0">
          {{ 'COURSES.ENROLL' | translate }}
        </button>
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .course-list {
      height: 400px;
      width: 100%;
    }
    .course-card {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    @media (max-width: 768px) {
      .course-list {
        height: 300px;
      }
    }
  `]
})
export class CourseListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  courses: any[] = [];
  enrolledCourseIds: string[] = [];

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadCourses();
    this.loadEnrolledCourses();
  }

  loadCourses() {
    this.courseService.getCourses(1, 20).subscribe(
      (data: any) => this.courses = data.courses,
      error => console.error('Error fetching courses:', error)
    );
  }

  loadEnrolledCourses() {
    this.courseService.getEnrolledCourses().subscribe(
      (enrolledCourses: any[]) => {
        this.enrolledCourseIds = enrolledCourses.map(course => course._id);
      },
      error => console.error('Error fetching enrolled courses:', error)
    );
  }

  isEnrolled(courseId: string): boolean {
    return this.enrolledCourseIds.includes(courseId);
  }

  enrollInCourse(courseId: string) {
    this.courseService.enrollInCourse(courseId).subscribe(
      () => {
        this.enrolledCourseIds.push(courseId);
        // Show success message
      },
      error => console.error('Error enrolling in course:', error)
    );
  }
}