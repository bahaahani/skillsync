import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-assessment',
  template: `
    <form (ngSubmit)="createAssessment()">
      <!-- Add form fields for assessment creation -->
      <button type="submit">Create Assessment</button>
    </form>
  `
})
export class AssessmentComponent {
  assessmentData: any = {};

  constructor(private apiService: ApiService) {}

  createAssessment() {
    this.apiService.createAssessment(this.assessmentData).subscribe(
      response => console.log('Assessment created:', response),
      error => console.error('Error creating assessment:', error)
    );
  }
}