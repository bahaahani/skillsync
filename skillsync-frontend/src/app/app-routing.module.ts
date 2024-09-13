import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { RegisterComponent } from './components/register/register.component';
import { TwoFactorSettingsComponent } from './components/two-factor-settings/two-factor-settings.component';


const routes: Routes = [
  { path: 'courses', loadChildren: () => import('./modules/course/course.module').then(m => m.CourseModule) },
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: 'ADMIN' }
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'two-factor-settings', component: TwoFactorSettingsComponent, canActivate: [AuthGuard] },
  { path: 'recommendations', component: CourseRecommendationsComponent, canActivate: [AuthGuard] },
  { path: 'courses/:courseId/forum', component: ForumTopicsComponent, canActivate: [AuthGuard] },
  { path: 'courses/:courseId/forum/:topicId', component: ForumPostsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'course-recommendations', component: CourseRecommendationsComponent },
  { path: 'forum-topics', component: ForumTopicsComponent },
  { path: 'forum-posts', component: ForumPostsComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./components/register/register.module').then(m => m.RegisterModule) },
  { path: 'password-reset', loadChildren: () => import('./components/password-reset/password-reset.module').then(m => m.PasswordResetModule) },
  { path: 'two-factor-settings', loadChildren: () => import('./components/two-factor-settings/two-factor-settings.module').then(m => m.TwoFactorSettingsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }