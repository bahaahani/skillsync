import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCatalogRoutingModule } from './course-catalog-routing.module';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';

@NgModule({
  declarations: [CourseListComponent, CourseDetailComponent],
  imports: [
    CommonModule,
    CourseCatalogRoutingModule
  ]
})
export class CourseCatalogModule { }