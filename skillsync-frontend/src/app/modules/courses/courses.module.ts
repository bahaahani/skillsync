import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatModules } from '../../modules/mat-modules';

import { CoursesComponent } from '../../components/courses/courses.component';
import { CourseListComponent } from '../../components/course-list/course-list.component';
import { CourseDetailsComponent } from '../../components/course-details/course-details.component';
import { CourseSearchComponent } from '../../components/course-search/course-search.component';
import { CourseRecommendationsComponent } from '../../components/course-recommendations/course-recommendations.component';
import { EnrolledCoursesComponent } from '../../components/enrolled-courses/enrolled-courses.component';
import { CourseForumComponent } from '../../components/course-forum/course-forum.component';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
    children: [
      { path: ':id', component: CourseDetailsComponent },
      { path: ':id/forum', component: CourseForumComponent }
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
    CourseForumComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TranslateModule,
    MatModules
  ]
})
export class CoursesModule { }