import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-user-progress',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './user-progress.component.html',
  styleUrls: ['./user-progress.component.css']
})
export class UserProgressComponent implements OnInit {
  courseId: string | null = null;
  progress: number = 0;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    if (this.courseId) {
      this.loadCourseProgress();
    }
  }

  loadCourseProgress() {
    if (!this.courseId) return;

    this.isLoading = true;
    this.courseService.getCourseProgress(this.courseId).subscribe({
      next: (progress) => {
        this.progress = progress;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading course progress:', error);
        this.isLoading = false;
      }
    });
  }
}