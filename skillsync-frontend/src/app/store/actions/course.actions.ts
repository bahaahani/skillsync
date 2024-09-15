import { createAction, props } from '@ngrx/store';
import { Course } from '../../models/course.model';

export const loadCourses = createAction(
  '[Course] Load Courses',
  props<{ page: number; pageSize: number; filters?: any }>()
);

export const loadCoursesSuccess = createAction(
  '[Course] Load Courses Success',
  props<{ courses: Course[]; totalItems: number }>()
);

export const loadCoursesFailure = createAction(
  '[Course] Load Courses Failure',
  props<{ error: any }>()
);

export const rateCourse = createAction(
  '[Course] Rate Course',
  props<{ courseId: string; rating: number }>()
);

export const rateCourseSuccess = createAction(
  '[Course] Rate Course Success',
  props<{ courseId: string; rating: number }>()
);

export const rateCourseFailure = createAction(
  '[Course] Rate Course Failure',
  props<{ error: any }>()
);

export const enrollCourse = createAction(
  '[Course] Enroll Course',
  props<{ courseId: string }>()
);

export const enrollCourseSuccess = createAction(
  '[Course] Enroll Course Success',
  props<{ courseId: string }>()
);

export const enrollCourseFailure = createAction(
  '[Course] Enroll Course Failure',
  props<{ error: any }>()
);

export const filterCourses = createAction(
  '[Course] Filter Courses',
  props<{ filters: any }>()
);

// ... other actions