import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-course-recommendations',
  template: `
    <div *ngIf="recommendations">
      <h2>Recommended Courses</h2>
      <ul>
        <li *ngFor="let course of recommendations">
          {{ course.title }}
        </li>
      </ul>
    </div>
  `
})
export class CourseRecommendationsComponent implements OnInit {
  recommendations: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getCourseRecommendations().subscribe(
      data => this.recommendations = data,
      error => console.error('Error fetching recommendations:', error)
    );
  }
}