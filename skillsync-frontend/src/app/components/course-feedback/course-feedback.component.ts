import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-course-feedback',
  templateUrl: './course-feedback.component.html',
})
export class CourseFeedbackComponent {
  @Input() courseId!: string;
  feedback: string = '';

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  submitFeedback() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Submit Feedback',
        message: 'Are you sure you want to submit this feedback?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.submitCourseFeedback(this.courseId, { feedback: this.feedback }).subscribe(
          response => {
            console.log('Feedback submitted:', response);
            this.feedback = ''; // Clear the feedback after submission
          },
          error => console.error('Error submitting feedback:', error)
        );
      }
    });
  }
}