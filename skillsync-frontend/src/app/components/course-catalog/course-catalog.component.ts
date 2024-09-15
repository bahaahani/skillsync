import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-catalog',
  templateUrl: './course-catalog.component.html',
  styleUrls: ['./course-catalog.component.css']
})
export class CourseCatalogComponent implements OnInit {
  searchTerm: string = '';
  levelFilter: string = '';
  durationFilter: number | null = null;
  tagFilter: string[] = [];
  filteredCourses: Course[] = [];
  isLoading: boolean = false;
  totalCourses: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  levels: string[] = ['Beginner', 'Intermediate', 'Advanced'];
  chipList: any;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getCourses(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.filteredCourses = response.courses;
        this.totalCourses = response.totalItems;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
      }
    );
  }

  onSearchChange(): void {
    // Implement search logic
    this.loadCourses();
  }

  onLevelFilterChange(): void {
    // Implement level filter logic
    this.loadCourses();
  }

  onDurationFilterChange(): void {
    // Implement duration filter logic
    this.loadCourses();
  }

  removeTagFilter(tag: string): void {
    // Implement tag removal logic
    this.loadCourses();
  }

  addTagFilter(event: any): void {
    // Implement tag addition logic
    this.loadCourses();
  }

  toggleWishlist(course: Course): void {
    // Implement wishlist toggle logic
  }

  onRatingChange(courseId: string, event: any): void {
    const rating = event.value;
    // Implement rating change logic
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCourses();
  }

  enrollCourse(courseId: string): void {
    // Implement course enrollment logic
  }
}