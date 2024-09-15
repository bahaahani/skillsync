import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as CourseActions from '../actions/course.actions';
import { CourseService } from '../../services/course.service';

@Injectable()
export class CourseEffects {
  loadCourses$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.loadCourses),
    mergeMap(({ page, pageSize, filters }) => this.courseService.getCourses(page, pageSize, filters)
      .pipe(
        map(response => CourseActions.loadCoursesSuccess({ 
          courses: response.courses,
          totalItems: response.totalItems 
        })),
        catchError(error => of(CourseActions.loadCoursesFailure({ error })))
      ))
    )
  );

  rateCourse$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.rateCourse),
    mergeMap(({ courseId, rating }) => this.courseService.rateCourse(courseId, rating)
      .pipe(
        map(() => CourseActions.rateCourseSuccess({ courseId, rating })),
        catchError(error => of(CourseActions.rateCourseFailure({ error })))
      ))
    )
  );

  enrollCourse$ = createEffect(() => this.actions$.pipe(
    ofType(CourseActions.enrollCourse),
    mergeMap(({ courseId }) => this.courseService.enrollInCourse(courseId)
      .pipe(
        map(() => CourseActions.enrollCourseSuccess({ courseId })),
        catchError(error => of(CourseActions.enrollCourseFailure({ error })))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private courseService: CourseService
  ) {}
}