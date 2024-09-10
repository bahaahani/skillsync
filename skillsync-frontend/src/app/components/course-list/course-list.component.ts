import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

interface PaginatedCourses {
  courses: Course[];
  totalCount: number;
}

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  private courseUpdateSubscription: Subscription | null = null;

  constructor(
    private courseService: CourseService,
  ) { }

  ngOnInit() {
    this.loadCourses();
    // Remove the setupRealTimeUpdates() call if it's not implemented
  }

  ngOnDestroy() {
    if (this.courseUpdateSubscription) {
      this.courseUpdateSubscription.unsubscribe();
    }
  }

  loadCourses() {
    this.courseService.getCourses().subscribe(
      (data: PaginatedCourses) => {
        this.courses = data.courses;
      },
      (error) => {
        console.error('Error loading courses:', error);
      }
    );
  }

  // Remove or comment out the setupRealTimeUpdates and joinCourse methods if they're not used
}