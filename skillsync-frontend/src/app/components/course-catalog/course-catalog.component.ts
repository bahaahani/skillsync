import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-catalog',
  template: `
    <div class="course-catalog">
      <h2>{{ 'COURSES.CATALOG' | translate }}</h2>
      <div class="categories">
        <button *ngFor="let category of categories" (click)="selectCategory(category)">
          {{ category }}
        </button>
      </div>
      <div class="courses">
        <div *ngFor="let course of filteredCourses">
          <h3>{{ course.title }}</h3>
          <p>{{ course.description }}</p>
          <a [routerLink]="['/courses', course._id]">{{ 'COURSES.VIEW_DETAILS' | translate }}</a>
        </div>
      </div>
    </div>
  `
})
export class CourseCatalogComponent implements OnInit {
  categories: string[] = [];
  allCourses: any[] = [];
  filteredCourses: any[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadCourses();
  }

  loadCategories() {
    // Implement this when you have a method to fetch categories
    this.categories = ['All', 'Programming', 'Design', 'Business'];
  }

  loadCourses() {
    this.courseService.getCourses().subscribe(
      (data: any) => {
        this.allCourses = data.courses;
        this.filteredCourses = this.allCourses;
      },
      error => console.error('Error fetching courses:', error)
    );
  }

  selectCategory(category: string) {
    if (category === 'All') {
      this.filteredCourses = this.allCourses;
    } else {
      this.filteredCourses = this.allCourses.filter(course => course.category === category);
    }
  }
}