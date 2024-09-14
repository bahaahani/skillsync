import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { RegisterComponent } from './components/register/register.component';
import { TwoFactorSettingsComponent } from './components/two-factor-settings/two-factor-settings.component';
import { CourseRecommendationsComponent } from './components/course-recommendations/course-recommendations.component';
import { ForumTopicsComponent } from './components/forum-topics/forum-topics.component';
import { ForumPostsComponent } from './components/forum-posts/forum-posts.component';


const routes: Routes = [
  { path: 'courses', component: CourseRecommendationsComponent },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }