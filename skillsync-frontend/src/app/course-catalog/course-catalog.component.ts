import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-catalog.component.html',
  styleUrls: ['./course-catalog.component.css']
})
export class CourseCatalogComponent implements OnInit {
  courses: any[] = [];
  enrollmentMessage: string = '';

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/courses').subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      }
    });
  }

  enrollCourse(courseId: string) {
    this.authService.enrollInCourse(courseId).subscribe({
      next: (response) => {
        this.enrollmentMessage = 'Successfully enrolled in the course';
        // Update the local course list to reflect enrollment
        const enrolledCourse = this.courses.find(course => course._id === courseId);
        if (enrolledCourse) {
          enrolledCourse.isEnrolled = true;
        }
      },
      error: (error) => {
        this.enrollmentMessage = 'Error enrolling in the course';
        console.error('Error enrolling in course:', error);
      }
    });
  }
}
