import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RecommendationService } from '../../services/recommendation.service';
import { FeatureFlagService } from '../../services/feature-flag.service';

@Component({
  selector: 'app-course-recommendations',
  templateUrl: './course-recommendations.component.html',
  styleUrls: ['./course-recommendations.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseRecommendationsComponent implements OnInit {
  personalizedRecommendations: any[] = [];
  popularCourses: any[] = [];
  isLoading = false;
  showNewRecommendationAlgorithm = false;

  constructor(
    private recommendationService: RecommendationService,
    private featureFlagService: FeatureFlagService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRecommendations();
    this.checkFeatureFlags();
  }

  loadRecommendations() {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.recommendationService.getPersonalizedRecommendations().subscribe({
      next: (recommendations) => {
        this.personalizedRecommendations = recommendations;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });

    this.recommendationService.getPopularCourses().subscribe({
      next: (courses) => {
        this.popularCourses = courses;
        this.cdr.markForCheck();
      }
    });
  }

  checkFeatureFlags() {
    this.featureFlagService.isFeatureEnabled('newRecommendationAlgorithm').subscribe({
      next: (isEnabled) => {
        this.showNewRecommendationAlgorithm = isEnabled;
        this.cdr.markForCheck();
      }
    });
  }
}