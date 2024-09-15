import { createReducer, on } from '@ngrx/store';
import * as CourseActions from '../actions/course.actions';
import { Course } from '../../models/course.model';

export interface CourseState {
  courses: Course[];
  filteredCourses: Course[];
  loading: boolean;
  error: any;
  totalItems: number;
}

export const initialState: CourseState = {
  courses: [],
  filteredCourses: [],
  loading: false,
  error: null,
  totalItems: 0
};

export const courseReducer = createReducer(
  initialState,
  on(CourseActions.loadCourses, state => ({ ...state, loading: true })),
  on(CourseActions.loadCoursesSuccess, (state, { courses, totalItems }) => ({ 
    ...state, 
    courses, 
    filteredCourses: courses,
    loading: false,
    totalItems
  })),
  on(CourseActions.loadCoursesFailure, (state, { error }) => ({ 
    ...state, 
    error, 
    loading: false 
  })),
  on(CourseActions.filterCourses, (state, { filters }) => ({
    ...state,
    filteredCourses: state.courses.filter(course => {
      // Implement your filtering logic here
      return true; // Placeholder
    })
  })),
  on(CourseActions.enrollCourseSuccess, (state, { courseId }) => ({
    ...state,
    courses: state.courses.map(course =>
      course._id === courseId ? { ...course, isEnrolled: true } : course
    ),
    filteredCourses: state.filteredCourses.map(course =>
      course._id === courseId ? { ...course, isEnrolled: true } : course
    )
  })),
  on(CourseActions.rateCourseSuccess, (state, { courseId, rating }) => ({
    ...state,
    courses: state.courses.map(course =>
      course._id === courseId ? { ...course, userRating: rating } : course
    ),
    filteredCourses: state.filteredCourses.map(course =>
      course._id === courseId ? { ...course, userRating: rating } : course
    )
  }))
);