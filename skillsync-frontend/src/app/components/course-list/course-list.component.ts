import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { SocketService } from '../../services/socket.service';

interface Course {
  id: string;
  title: string;
  description: string;
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
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.loadCourses();
    this.setupRealTimeUpdates();
  }

  ngOnDestroy() {
    if (this.courseUpdateSubscription) {
      this.courseUpdateSubscription.unsubscribe();
    }
  }

  loadCourses() {
    this.courseService.getCourses().subscribe(
      (data: Course[]) => {
        this.courses = data;
      },
      (error) => {
        console.error('Error loading courses:', error);
      }
    );
  }

  setupRealTimeUpdates() {
    this.courseUpdateSubscription = this.socketService.onCourseUpdate().subscribe(
      (updatedCourse: Course) => {
        const index = this.courses.findIndex(course => course.id === updatedCourse.id);
        if (index !== -1) {
          this.courses[index] = updatedCourse;
        } else {
          this.courses.push(updatedCourse);
        }
      }
    );
  }

  joinCourse(courseId: string) {
    this.courseService.joinCourse(courseId);
  }
}