import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModules } from '../mat-modules'; // We'll create this shared module for Material imports

import { CourseCatalogComponent } from '../../course-catalog/course-catalog.component';
import { CourseDetailsComponent } from '../../course-details/course-details.component';
import { CourseRatingComponent } from '../../components/course-rating/course-rating.component';
import { CourseReviewComponent } from '../../components/course-review/course-review.component';

const routes: Routes = [
  { path: '', component: CourseCatalogComponent },
  { path: ':id', component: CourseDetailsComponent }
];

@NgModule({
  declarations: [
    CourseCatalogComponent,
    CourseDetailsComponent,
    CourseRatingComponent,
    CourseReviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatModules,
    RouterModule.forChild(routes)
  ]
})
export class CourseModule { }