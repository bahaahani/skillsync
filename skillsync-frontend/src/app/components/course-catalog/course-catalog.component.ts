import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Course } from '../../models/course.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-course-catalog',
  templateUrl: './course-catalog.component.html'
})
export class CourseCatalogComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  pagedCourses: Course[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';

  // Pagination
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.error = null;
    this.apiService.getCourses().subscribe(
      (data: Course[]) => {
        this.courses = data;
        this.filteredCourses = data;
        this.updatePagedCourses();
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching courses:', error);
        this.error = 'Failed to load courses. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  searchCourses() {
    this.filteredCourses = this.courses.filter(course =>
      course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updatePagedCourses();
    this.paginator.firstPage();
  }

  updatePagedCourses() {
    const startIndex = this.paginator ? this.paginator.pageIndex * this.paginator.pageSize : 0;
    this.pagedCourses = this.filteredCourses.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.updatePagedCourses();
  }
}