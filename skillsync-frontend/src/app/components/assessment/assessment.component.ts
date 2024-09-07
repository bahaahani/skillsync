import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AssessmentService } from '../../services/assessment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AssessmentComponent implements OnInit {
  assessmentForm: FormGroup;
  currentQuestion: number = 0;
  questions: any[] = [];
  assessmentCompleted: boolean = false;
  score: number = 0;
  userAnswers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private assessmentService: AssessmentService
  ) {
    this.assessmentForm = this.fb.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadAssessment();
  }

  loadAssessment() {
    this.assessmentService.getAssessment().subscribe(
      (assessment) => {
        this.questions = assessment.questions;
        this.currentQuestion = 0;
        this.assessmentCompleted = false;
        this.score = 0;
        this.userAnswers = [];
      },
      (error) => console.error('Error loading assessment', error)
    );
  }

  submitAnswer() {
    if (this.assessmentForm.valid) {
      this.userAnswers.push(this.assessmentForm.value.answer);
      this.assessmentForm.reset();

      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
      } else {
        this.completeAssessment();
      }
    }
  }

  completeAssessment() {
    this.assessmentService.submitAssessment(this.userAnswers).subscribe(
      (result) => {
        this.score = result.score;
        this.assessmentCompleted = true;
      },
      (error) => console.error('Error submitting assessment', error)
    );
  }

  restartAssessment() {
    this.loadAssessment();
  }
}