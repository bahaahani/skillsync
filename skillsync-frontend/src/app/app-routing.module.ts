import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseCatalogComponent } from './components/course-catalog/course-catalog.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: 'courses', component: CourseCatalogComponent },
  { path: 'course/:id', component: CourseDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }