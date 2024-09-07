import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssessmentService } from '../../services/assessment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [AssessmentService]
})
export class AssessmentsComponent implements OnInit {
  personalizedAssessments: any[] = [];
  allAssessments: any[] = [];
  assessmentHistory: any[] = [];
  certifications: any[] = [];
  assessmentForm: FormGroup;

  constructor(
    private assessmentService: AssessmentService,
    private fb: FormBuilder
  ) {
    this.assessmentForm = this.fb.group({
      title: ['', Validators.required],
      skill: ['', Validators.required],
      questions: ['', [Validators.required, Validators.min(1)]],
      dueDate: ['', Validators.required],
      passingGrade: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit() {
    this.loadPersonalizedAssessments();
    this.loadAllAssessments();
    this.loadAssessmentHistory();
    this.loadCertifications();
  }

  loadPersonalizedAssessments() {
    this.assessmentService.getPersonalizedAssessments().subscribe(
      (assessments: any[]) => {
        this.personalizedAssessments = assessments;
      },
      (error: any) => console.error('Error loading personalized assessments', error)
    );
  }

  loadAllAssessments() {
    this.assessmentService.getAllAssessments().subscribe(
      (assessments: any[]) => {
        this.allAssessments = assessments;
      },
      (error: any) => console.error('Error loading all assessments', error)
    );
  }

  loadAssessmentHistory() {
    this.assessmentService.getAssessmentHistory().subscribe(
      (history: any[]) => {
        this.assessmentHistory = history;
      },
      (error: any) => console.error('Error loading assessment history', error)
    );
  }

  loadCertifications() {
    this.assessmentService.getCertifications().subscribe(
      (certifications: any[]) => {
        this.certifications = certifications;
      },
      (error: any) => console.error('Error loading certifications', error)
    );
  }

  createAssessment() {
    if (this.assessmentForm.valid) {
      this.assessmentService.createAssessment(this.assessmentForm.value).subscribe(
        (newAssessment: any) => {
          this.allAssessments.push(newAssessment);
          this.assessmentForm.reset();
        },
        (error: any) => console.error('Error creating assessment', error)
      );
    }
  }

  takeAssessment(assessmentId: string) {
    // Implement logic to start an assessment
  }

  applyCertification(certificationId: string) {
    // Implement logic to apply for a certification
  }
}