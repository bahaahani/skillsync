import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  course: any;
  isEnrolled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private translateService: TranslateService,
    private errorHandler: ErrorHandlingService,
  ) { }

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourseDetails(courseId);
    }
  }

  loadCourseDetails(courseId: string) {
    this.courseService.getCourseDetails(courseId).subscribe(
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