import { Component, Input, OnInit } from '@angular/core';
import { ImageOptimizationService } from '../../services/image-optimization.service';

@Component({
  selector: 'app-course-card',
  template: `
    <div class="course-card">
      <img [src]="optimizedImageUrl" [alt]="course.title" loading="lazy">
      <h3>{{ course.title }}</h3>
      <p>{{ course.description }}</p>
      <p>{{ 'COURSES.ENROLLED_STUDENTS' | translate }}: {{ course.enrolledCount }}</p>
      <a [routerLink]="['/courses', course._id]">{{ 'COURSES.VIEW_DETAILS' | translate }}</a>
    </div>
  `,
  styles: [`
    .course-card img {
      width: 100%;
      height: auto;
    }
  `]
})
export class CourseCardComponent implements OnInit {
  @Input() course: any;
  optimizedImageUrl: string;

  constructor(private imageOptimizationService: ImageOptimizationService) {}

  ngOnInit() {
    this.optimizedImageUrl = this.imageOptimizationService.optimizeImageUrl(this.course.imageUrl);
    this.imageOptimizationService.preloadImage(this.optimizedImageUrl);
  }
}