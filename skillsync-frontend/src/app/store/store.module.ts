import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { courseReducer } from './reducers/course.reducer';
import { CourseEffects } from './effects/course.effects';

@NgModule({
  imports: [
    StoreModule.forRoot({ course: courseReducer }),
    EffectsModule.forRoot([CourseEffects])
  ]
})
export class AppStoreModule { }