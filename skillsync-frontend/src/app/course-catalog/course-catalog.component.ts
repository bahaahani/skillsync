import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Course } from '../models/course.model';
import { Store } from '@ngrx/store';
import * as CourseActions from '../store/actions/course.actions';
import { Observable } from 'rxjs';

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
  filteredCourses$: Observable<Course[]>;
  isLoading$: Observable<boolean>;
  totalCourses$: Observable<number>;
  pageSize: number = 10;
  currentPage: number = 1;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  levels: string[] = ['Beginner', 'Intermediate', 'Advanced'];
  chipList: any;

  constructor(private store: Store<{ course: any }>) {
    this.filteredCourses$ = this.store.select(state => state.course.filteredCourses);
    this.isLoading$ = this.store.select(state => state.course.loading);
    this.totalCourses$ = this.store.select(state => state.course.totalItems);
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.store.dispatch(CourseActions.loadCourses({
      page: this.currentPage,
      pageSize: this.pageSize,
      filters: {
        searchTerm: this.searchTerm,
        level: this.levelFilter,
        duration: this.durationFilter,
        tags: this.tagFilter
      }
    }));
  }

  onSearchChange(): void {
    this.loadCourses();
  }

  onLevelFilterChange(): void {
    this.loadCourses();
  }

  onDurationFilterChange(): void {
    this.loadCourses();
  }

  removeTagFilter(tag: string): void {
    this.tagFilter = this.tagFilter.filter(t => t !== tag);
    this.loadCourses();
  }

  addTagFilter(event: any): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tagFilter.push(value);
    }
    event.chipInput!.clear();
    this.loadCourses();
  }

  toggleWishlist(course: Course): void {
    // Implement wishlist toggle logic using NgRx actions
  }

  onRatingChange(courseId: string, rating: number): void {
    this.store.dispatch(CourseActions.rateCourse({ courseId, rating }));
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCourses();
  }

  enrollCourse(courseId: string): void {
    this.store.dispatch(CourseActions.enrollCourse({ courseId }));
  }
}
