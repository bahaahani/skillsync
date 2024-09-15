import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-reviews',
  template: '<p>Course Reviews Component</p>'
})
export class CourseReviewsComponent {
  @Input() courseId!: string;
}