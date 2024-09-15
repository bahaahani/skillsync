import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { Course } from '../../models/course.model';
import { StudentProgress } from '../../models/student-progress.model';

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {
  instructorCourses: Course[] = [];
  selectedCourseProgress: StudentProgress[] = [];

  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) { }

  ngOnInit() {
    this.loadInstructorCourses();
  }

  loadInstructorCourses() {
    this.courseService.getInstructorCourses().subscribe(
      (data: Course[]) => this.instructorCourses = data,
      (error: any) => this.errorHandler.handleError(error, 'INSTRUCTOR.COURSES_LOAD_ERROR')
    );
  }

  openCreateCourseDialog() {
    // Implement dialog to create a new course
  }

  editCourse(courseId: string) {
    // Implement course editing functionality
  }

  viewAnalytics(courseId: string) {
    // Implement analytics viewing functionality
  }

  onCourseSelect(courseId: string) {
    this.courseService.getCourseStudentProgress(courseId).subscribe(
      (data: StudentProgress[]) => this.selectedCourseProgress = data,
      (error: any) => this.errorHandler.handleError(error, 'INSTRUCTOR.PROGRESS_LOAD_ERROR')
    );
  }
}