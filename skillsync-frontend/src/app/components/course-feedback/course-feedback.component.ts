import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-course-feedback',
  templateUrl: './course-feedback.component.html',
  styleUrls: ['./course-feedback.component.css']
})
export class CourseFeedbackComponent implements OnInit {
  @Input() courseId!: string;
  feedbackForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {
    this.feedbackForm = this.formBuilder.group({
      rating: ['', Validators.required],
      feedback: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  submitFeedback(): void {
    if (this.feedbackForm.valid) {
      this.courseService.addCourseFeedback(this.courseId, this.feedbackForm.value).subscribe(
        () => {
          this.feedbackForm.reset();
          // Show success message
        },
        (error: any) => {
          this.errorHandler.handleError(error, 'Error submitting feedback');
        }
      );
    }
  }
}