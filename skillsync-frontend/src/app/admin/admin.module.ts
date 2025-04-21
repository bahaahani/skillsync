import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

// Placeholder component
@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="container mt-5">
      <h2>Admin Dashboard</h2>
      <p>Welcome to the admin dashboard. This area is under construction.</p>
    </div>
  `,
  standalone: false
})
export class AdminDashboardComponent {}

// Create routes
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardComponent }
];

@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { } 