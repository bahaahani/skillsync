import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CourseRecommendationsComponent } from './components/course-recommendations/course-recommendations.component';
import { ForumTopicsComponent } from './components/forum-topics/forum-topics.component';
import { ForumPostsComponent } from './components/forum-posts/forum-posts.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

const routes: Routes = [
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