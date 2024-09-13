import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-course-rating',
  template: `
    <mat-icon *ngFor="let star of stars; let i = index"
              (click)="onRatingChange(i + 1)"
              [class.filled]="i < (rating || 0)"
              [matTooltip]="readOnly ? 'Average rating' : 'Rate this course'"
              [matTooltipPosition]="'above'">
      star
    </mat-icon>
  `,
  styles: [`
    mat-icon {
      cursor: pointer;
      color: #ccc;
    }
    mat-icon.filled {
      color: gold;
    }
  `]
})
export class CourseRatingComponent {
  @Input() rating: number | undefined = 0;
  @Input() readOnly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];

  onRatingChange(newRating: number): void {
    if (!this.readOnly) {
      this.rating = newRating;
      this.ratingChange.emit(this.rating);
    }
  }
}