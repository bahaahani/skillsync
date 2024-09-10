import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../../models/course.model';
import { Lesson } from '../../services/course.service';

@Component({
  selector: 'app-course-progress',
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.css']
})
export class CourseProgressComponent {
  @Input() course!: Course;
  @Output() lessonCompleted = new EventEmitter<{ courseId: string, lessonId: string, completed: boolean }>();

  toggleLessonCompletion(lesson: Lesson) {
    lesson.completed = !lesson.completed;
    this.lessonCompleted.emit({
      courseId: this.course._id,
      lessonId: lesson._id,
      completed: lesson.completed
    });
  }

  get progress(): number {
    if (!this.course.lessons || this.course.lessons.length === 0) {
      return 0;
    }
    const completedLessons = this.course.lessons.filter((lesson: Lesson) => lesson.completed).length;
    return (completedLessons / this.course.lessons.length) * 100;
  }
}