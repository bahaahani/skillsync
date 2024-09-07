import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CoursesComponent } from './components/courses/courses.component';
import { AssessmentsComponent } from './components/assessments/assessments.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LearningPathComponent } from './components/learning-path/learning-path.component';
import { MentorshipComponent } from './components/mentorship/mentorship.component';
import { AuthGuard } from './guards/auth.guard';
import { NotificationsComponent } from './components/notifications/notifications.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
  { path: 'assessments', component: AssessmentsComponent, canActivate: [AuthGuard] },
  { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'learning-path', component: LearningPathComponent, canActivate: [AuthGuard] },
  { path: 'mentorship', component: MentorshipComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }