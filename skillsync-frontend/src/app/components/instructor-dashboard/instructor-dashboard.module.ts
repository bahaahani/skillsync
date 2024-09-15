import { NgModule } from '@angular/core';
import { SharedModule } from '../../modules/shared/shared.module';
import { InstructorDashboardComponent } from './instructor-dashboard.component';

@NgModule({
  declarations: [InstructorDashboardComponent],
  imports: [SharedModule],
  exports: [InstructorDashboardComponent]
})
export class InstructorDashboardModule { }