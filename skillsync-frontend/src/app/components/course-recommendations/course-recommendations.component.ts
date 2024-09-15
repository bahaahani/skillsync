import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-course-recommendations',
  templateUrl: './course-recommendations.component.html',
  styleUrls: ['./course-recommendations.component.css']
})
export class CourseRecommendationsComponent implements OnInit {
  recommendedCourses: any[] = [];
  categories: string[] = [];
  difficulties: string[] = [];
  selectedCategory: string = '';
  selectedDifficulty: string = '';

  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadDifficulties();
    this.updateRecommendations();
  }

  loadCategories() {
    this.courseService.getCategories().subscribe(
      categories => this.categories = categories,
      error => this.errorHandler.handleError(error, 'COURSES.LOAD_CATEGORIES_ERROR')
    );
  }

  loadDifficulties() {
    this.courseService.getDifficulties().subscribe(
      difficulties => this.difficulties = difficulties,
      error => this.errorHandler.handleError(error, 'COURSES.LOAD_DIFFICULTIES_ERROR')
    );
  }

  updateRecommendations() {
    this.courseService.getRecommendations(this.selectedCategory, this.selectedDifficulty).subscribe(
      courses => this.recommendedCourses = courses,
      error => this.errorHandler.handleError(error, 'COURSES.LOAD_RECOMMENDATIONS_ERROR')
    );
  }
}