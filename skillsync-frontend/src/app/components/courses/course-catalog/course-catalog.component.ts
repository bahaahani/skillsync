import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-course-catalog',
    templateUrl: './course-catalog.component.html',
    styleUrls: ['./course-catalog.component.css'],
    standalone: true,
    imports: [FormsModule, CommonModule]
})
export class CourseCatalogComponent implements OnInit {
    courses: any[] = [];
    filteredCourses: any[] = [];
    searchTerm: string = '';

    ngOnInit() {
        // TODO: Fetch actual course data from backend
        this.courses = [
            { id: 1, title: 'Angular Basics', category: 'Web Development' },
            { id: 2, title: 'Advanced JavaScript', category: 'Programming' },
            { id: 3, title: 'Node.js Fundamentals', category: 'Backend Development' }
        ];
        this.filteredCourses = this.courses;
    }

    searchCourses() {
        this.filteredCourses = this.courses.filter(course =>
            course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }
}