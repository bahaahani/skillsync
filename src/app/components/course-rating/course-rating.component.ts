import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-rating',
  template: `
    <div>
      <!-- Implement your rating display logic here -->
      Rating: {{ rating }} ({{ readonly ? 'Read-only' : 'Editable' }})
    </div>
  `,
})
export class CourseRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
}