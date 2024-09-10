import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Course } from '../models/course.model';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  courseId!: string;
  courseDetails: Course | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCourseDetails();
  }

  loadCourseDetails() {
    this.isLoading = true;
    this.apiService.getCourseDetails(this.courseId).subscribe(
      (data: Course) => {
        this.courseDetails = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching course details:', error);
        this.isLoading = false;
      }
    );
  }
}