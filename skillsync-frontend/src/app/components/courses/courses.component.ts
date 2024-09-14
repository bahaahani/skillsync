import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses(this.currentPage, this.pageSize, this.searchQuery).subscribe(
      (response: any) => {
        this.courses = response.courses;
        this.totalPages = response.totalPages;
      },
      error => this.errorHandler.handleError(error, 'COURSES.LOAD_ERROR')
    );
  }

  searchCourses() {
    this.currentPage = 1;
    this.loadCourses();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadCourses();
    }
  }
}