import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Course, CourseReview } from '../models/course.model';
import { CourseReviewComponent } from '../components/course-review/course-review.component';

@Component({
  selector: 'app-course-catalog',
  templateUrl: './course-catalog.component.html',
  styleUrls: ['./course-catalog.component.css'],
})
export class CourseCatalogComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  levelFilter: string = 'all';
  durationFilter: number | null = null;
  tagFilter: string[] = [];
  levels: string[] = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  isLoading: boolean = false;

  // Pagination
  pageSize: number = 10;
  pageIndex: number = 0;
  totalCourses: number = 0;

  newReviewContent: string = '';
  newReviewRating: number = 0;
  reviewPageSize: number = 5;
  reviewPageIndex: number = 0;

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.courseService.getCourses(this.pageIndex + 1, this.pageSize).subscribe({
      next: (data) => {
        this.courses = data.courses || []; // Ensure courses is always an array
        this.totalCourses = data.totalCount;
        this.courses.forEach(course => {
          if (course.isEnrolled) {
            this.loadCourseProgress(course);
          }
        });
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
        this.showErrorMessage('Error fetching courses. Please try again later.');
        this.isLoading = false;
        this.courses = []; // Initialize as empty array in case of error
        this.applyFilters(); // Still apply filters to show empty state
      }
    });
  }

  loadCourseProgress(course: Course) {
    this.courseService.getCourseProgress(course._id).subscribe({
      next: (progress) => {
        course.progress = progress;
      },
      error: (error) => {
        console.error('Error fetching course progress:', error);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCourses();
  }

  applyFilters() {
    if (!this.courses) {
      this.filteredCourses = [];
      return;
    }

    this.filteredCourses = this.courses.filter(course =>
      (course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.levelFilter === 'all' || course.level === this.levelFilter) &&
      (this.durationFilter === null || course.duration <= this.durationFilter) &&
      (this.tagFilter.length === 0 || this.tagFilter.every(tag => course.tags.includes(tag)))
    );
  }

  onSearchChange() {
    this.applyFilters();
  }

  onLevelFilterChange() {
    this.applyFilters();
  }

  onDurationFilterChange() {
    this.applyFilters();
  }

  addTagFilter(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tagFilter.push(value);
      this.applyFilters();
    }
    event.chipInput!.clear();
  }

  removeTagFilter(tag: string): void {
    const index = this.tagFilter.indexOf(tag);
    if (index >= 0) {
      this.tagFilter.splice(index, 1);
      this.applyFilters();
    }
  }

  createCourse() {
    // Validate required fields
    if (!this.newCourse.title || !this.newCourse.category || !this.newCourse.instructor) {
      this.showErrorMessage('Title, category, and instructor are required fields');
      return;
    }

    const courseToCreate: Omit<Course, '_id'> = { ...this.newCourse };
    delete (courseToCreate as Partial<Course>)._id; // Type assertion to allow delete
    this.courseService.addCourse(courseToCreate).subscribe({
      next: (createdCourse) => {
        this.courses.push(createdCourse);
        this.resetNewCourse();
        this.applyFilters();
        this.showSuccessMessage('Course created successfully');
      },
      error: (error) => {
        console.error('Error creating course:', error);
        this.showErrorMessage('Error creating course. Please try again.');
      }
    });
  }

  resetNewCourse() {
    this.newCourse = {
      _id: '',
      title: '',
      description: '',
      isEnrolled: false,
      instructor: '',
      duration: 0,
      level: '',
      tags: [],
      rating: 0,
      category: '' // Added category property
    };
  }

  startEdit(course: Course) {
    this.editingCourse = { ...course };
  }

  updateCourse() {
    if (this.editingCourse) {
      this.courseService.updateCourse(this.editingCourse._id, this.editingCourse).subscribe({
        next: (updatedCourse) => {
          const index = this.courses.findIndex(c => c._id === updatedCourse._id);
          if (index !== -1) {
            this.courses[index] = updatedCourse;
          }
          this.editingCourse = null;
        },
        error: (error) => {
          console.error('Error updating course:', error);
        }
      });
    }
  }

  deleteCourse(courseId: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this course?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.courseService.deleteCourse(courseId).subscribe({
          next: () => {
            this.courses = this.courses.filter(course => course._id !== courseId);
            this.applyFilters(); // Use applyFilters instead of filterCourses
          },
          error: (error) => {
            console.error('Error deleting course:', error);
          }
        });
      }
    });
  }

  enrollCourse(courseId: string) {
    this.authService.enrollInCourse(courseId).subscribe({
      next: () => {
        this.enrollmentMessage = 'Successfully enrolled in the course';
        this.updateCourseEnrollmentStatus(courseId, true);
      },
      error: (error) => {
        this.enrollmentMessage = 'Error enrolling in the course';
        console.error('Error enrolling in course:', error);
      }
    });
  }

  private updateCourseEnrollmentStatus(courseId: string, isEnrolled: boolean) {
    const enrolledCourse = this.courses.find(course => course._id === courseId);
    if (enrolledCourse) {
      enrolledCourse.isEnrolled = isEnrolled;
    }
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  rateCourse(courseId: string, rating: number) {
    this.courseService.rateCourse(courseId, rating).subscribe({
      next: (updatedCourse) => {
        const index = this.courses.findIndex(c => c._id === updatedCourse._id);
        if (index !== -1) {
          this.courses[index] = {
            ...updatedCourse,
            userRating: rating
          };
          this.applyFilters();
        }
        this.showSuccessMessage('Course rated successfully');
      },
      error: (error) => {
        console.error('Error rating course:', error);
        this.showErrorMessage('Error rating course. Please try again.');
      }
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      if (!this.newCourse.tags) {
        this.newCourse.tags = [];
      }
      this.newCourse.tags.push(value);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    if (this.newCourse.tags) {
      const index = this.newCourse.tags.indexOf(tag);
      if (index >= 0) {
        this.newCourse.tags.splice(index, 1);
      }
    }
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  newCourse: Course = {
    _id: '',
    title: '',
    description: '',
    instructor: '',
    duration: 0,
    level: '',
    tags: [],
    isEnrolled: false,
    rating: 0,
    category: ''
  };

  editingCourse: Course | null = null;

  enrollmentMessage: string = ''; // Add this property

  onRatingChange(courseId: string, newRating: number) {
    if (newRating !== undefined && newRating !== null) {
      this.rateCourse(courseId, newRating);
    }
  }

  loadUserRating(course: Course) {
    this.courseService.getUserRating(course._id).subscribe({
      next: (data) => {
        course.userRating = data.rating;
      },
      error: (error) => {
        console.error('Error fetching user rating:', error);
      }
    });
  }

  updateCourseProgress(courseId: string, progress: number) {
    const course = this.courses.find(c => c._id === courseId);
    if (course) {
      course.progress = progress;
    }
  }

  toggleWishlist(course: Course) {
    if (course.isWishlisted) {
      this.courseService.removeFromWishlist(course._id).subscribe({
        next: (updatedCourse) => {
          course.isWishlisted = false;
          this.showSuccessMessage('Course removed from wishlist');
        },
        error: (error) => {
          console.error('Error removing course from wishlist:', error);
          this.showErrorMessage('Error removing course from wishlist. Please try again.');
        }
      });
    } else {
      this.courseService.addToWishlist(course._id).subscribe({
        next: (updatedCourse) => {
          course.isWishlisted = true;
          this.showSuccessMessage('Course added to wishlist');
        },
        error: (error) => {
          console.error('Error adding course to wishlist:', error);
          this.showErrorMessage('Error adding course to wishlist. Please try again.');
        }
      });
    }
  }

  onReviewAdded(course: Course, newReview: CourseReview) {
    if (!course.reviews) {
      course.reviews = [];
    }
    course.reviews.unshift(newReview);
    this.updateCourseAverageRating(course);
  }

  private updateCourseAverageRating(course: Course) {
    if (course.reviews && course.reviews.length > 0) {
      const sum = course.reviews.reduce((total, review) => total + review.rating, 0);
      course.rating = sum / course.reviews.length;
    }
  }
}
