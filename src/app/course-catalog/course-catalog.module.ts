import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatModule } from '../mat.module'; // Assuming you have a separate module for Material imports
import { CourseCatalogComponent } from './course-catalog.component';
import { CourseRatingComponent } from '../components/course-rating/course-rating.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatModule,
    RouterModule,
  ],
  declarations: [
    CourseCatalogComponent,
    CourseRatingComponent,
  ],
  exports: [
    CourseCatalogComponent,
  ],
})
export class CourseCatalogModule { }