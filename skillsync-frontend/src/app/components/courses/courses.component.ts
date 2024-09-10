import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  filteredCourses: any[] = [];
  enrolledCourses: any[] = [];
  recommendedCourses: any[] = [];
  searchTerm: string = '';
  courseForm: FormGroup;

  constructor(
    private courseService: CourseService,
    private fb: FormBuilder
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      duration: ['', Validators.required],
      skills: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCourses();
    this.loadEnrolledCourses();
    this.loadRecommendedCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe(
      (courses) => {
        this.courses = courses;
        this.filteredCourses = courses;
      },
      (error) => console.error('Error loading courses', error)
    );
  }

  loadEnrolledCourses() {
    this.courseService.getEnrolledCourses().subscribe(
      (courses) => {
        this.enrolledCourses = courses;
      },
      (error) => console.error('Error loading enrolled courses', error)
    );
  }

  loadRecommendedCourses() {
    this.courseService.getRecommendedCourses().subscribe(
      (courses) => {
        this.recommendedCourses = courses;
      },
      (error) => console.error('Error loading recommended courses', error)
    );
  }

  searchCourses() {
    this.filteredCourses = this.courses.filter(course =>
      course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  enrollInCourse(courseId: string) {
    this.courseService.enrollInCourse(courseId).subscribe(
      (enrolledCourse) => {
        this.enrolledCourses.push(enrolledCourse);
        // Remove from recommended courses if present
        this.recommendedCourses = this.recommendedCourses.filter(course => course.id !== courseId);
      },
      (error) => console.error('Error enrolling in course', error)
    );
  }

  addCourse() {
    if (this.courseForm.valid) {
      const courseData = {
        ...this.courseForm.value,
        skills: this.courseForm.value.skills.split(',').map((skill: string) => skill.trim())
      };
      this.courseService.addCourse(courseData).subscribe(
        (newCourse) => {
          this.courses.push(newCourse);
          this.courseForm.reset();
        },
        (error) => console.error('Error adding course', error)
      );
    }
  }
}