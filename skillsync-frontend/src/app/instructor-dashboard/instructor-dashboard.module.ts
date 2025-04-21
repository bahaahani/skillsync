import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

// Placeholder component
@Component({
  selector: 'app-instructor-dashboard',
  template: `
    <div class="container mt-5">
      <h2>Instructor Dashboard</h2>
      <p>Welcome to the instructor dashboard. This area is under construction.</p>
    </div>
  `,
  standalone: false
})
export class InstructorDashboardComponent {}

// Create routes
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: InstructorDashboardComponent }
];

@NgModule({
  declarations: [
    InstructorDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class InstructorDashboardModule { } 