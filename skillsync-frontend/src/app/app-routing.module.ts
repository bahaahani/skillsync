import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseCatalogComponent } from './course-catalog/course-catalog.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  // Public routes
  { path: 'courses', component: CourseCatalogComponent },
  { path: 'courses/:id', component: CourseDetailsComponent },
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  
  // Protected routes
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile', 
    component: UserProfileComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Instructor routes
  {
    path: 'instructor',
    canActivate: [AuthGuard],
    data: { roles: ['instructor', 'admin'] },
    loadChildren: () => import('./instructor-dashboard/instructor-dashboard.module').then(m => m.InstructorDashboardModule)
  },
  
  // Admin routes
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { role: 'admin' },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  
  // Fallback route
  { path: '**', redirectTo: '/courses' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }