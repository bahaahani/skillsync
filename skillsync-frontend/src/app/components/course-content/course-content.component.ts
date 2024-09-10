import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  // Remove the styleUrls line if you don't have a CSS file
})
export class CourseContentComponent implements OnInit {
  @Input() courseId!: string;
  content: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCourseContent();
  }

  loadCourseContent() {
    this.isLoading = true;
    this.error = null;
    this.apiService.getCourseContent(this.courseId).subscribe(
      data => {
        this.content = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching course content:', error);
        this.error = 'Failed to load course content. Please try again later.';
        this.isLoading = false;
      }
    );
  }
}