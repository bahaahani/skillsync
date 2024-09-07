import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LearningPathService } from '../../services/learning-path.service';

@Component({
    selector: 'app-learning-path',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './learning-path.component.html',
    styleUrls: ['./learning-path.component.css']
})
export class LearningPathComponent implements OnInit {
    learningPath: any[] = [];
    suggestedCourses: any[] = [];
    suggestedAssessments: any[] = [];

    constructor(private learningPathService: LearningPathService) { }

    ngOnInit() {
        this.loadLearningPath();
        this.loadSuggestedCourses();
        this.loadSuggestedAssessments();
    }

    loadLearningPath() {
        this.learningPathService.getLearningPath().subscribe(
            (path) => {
                this.learningPath = path;
            },
            (error) => console.error('Error loading learning path', error)
        );
    }

    loadSuggestedCourses() {
        this.learningPathService.getSuggestedCourses().subscribe(
            (courses) => {
                this.suggestedCourses = courses;
            },
            (error) => console.error('Error loading suggested courses', error)
        );
    }

    loadSuggestedAssessments() {
        this.learningPathService.getSuggestedAssessments().subscribe(
            (assessments) => {
                this.suggestedAssessments = assessments;
            },
            (error) => console.error('Error loading suggested assessments', error)
        );
    }
}