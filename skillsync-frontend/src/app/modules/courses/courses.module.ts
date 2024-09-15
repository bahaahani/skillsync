import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../shared/material.module';
import { CoursesComponent } from '../../components/courses/courses.component';
import { CourseListComponent } from '../../components/course-list/course-list.component';
import { CourseDetailsComponent } from '../../components/course-details/course-details.component';
import { CourseSearchComponent } from '../../components/course-search/course-search.component';
import { CourseRecommendationsComponent } from '../../components/course-recommendations/course-recommendations.component';
import { EnrolledCoursesComponent } from '../../components/enrolled-courses/enrolled-courses.component';
import { CourseForumComponent } from '../../components/course-forum/course-forum.component';
import { CourseRatingComponent } from '../../components/course-rating/course-rating.component';
import { CourseReviewComponent } from '../../components/course-review/course-review.component';
import { CourseFeedbackComponent } from '../../components/course-feedback/course-feedback.component';
import { SocialShareComponent } from '../../components/social-share/social-share.component';
import { UserDashboardComponent } from '../../components/user-dashboard/user-dashboard.component';
import { CourseReviewsComponent } from '../../components/course-reviews/course-reviews.component';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
    children: [
      { path: ':id', component: CourseDetailsComponent },
      { path: ':id/forum', component: CourseForumComponent },
    ]
  }
];

@NgModule({
  declarations: [
    CoursesComponent,
    CourseListComponent,
    CourseDetailsComponent,
    CourseSearchComponent,
    CourseRecommendationsComponent,
    EnrolledCoursesComponent,
    CourseForumComponent,
    CourseRatingComponent,
    CourseReviewComponent,
    CourseFeedbackComponent,
    SocialShareComponent,
    UserDashboardComponent,
    CourseRatingComponent,
    CourseReviewsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ScrollingModule,
    TranslateModule,
    MaterialModule
  ],
  exports: [
    CourseDetailsComponent,
    CourseForumComponent,
    CourseRatingComponent,
    CourseReviewComponent,
    CourseFeedbackComponent,
    SocialShareComponent,
    CourseRatingComponent,
    CourseReviewsComponent,
  ]
})
export class CoursesModule { }
