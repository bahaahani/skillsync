import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-course-progress',
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.css']
})
export class CourseProgressComponent implements OnInit {
  @Input() courseId!: string;
  progress: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProgress();
  }

  loadProgress() {
    this.apiService.getCourseProgress(this.courseId).subscribe(
      data => this.progress = data.progress,
      error => console.error('Error fetching course progress:', error)
    );
  }

  updateProgress() {
    this.apiService.updateCourseProgress(this.courseId, { progress: this.progress }).subscribe(
      response => console.log('Progress updated:', response),
      error => console.error('Error updating progress:', error)
    );
  }
}