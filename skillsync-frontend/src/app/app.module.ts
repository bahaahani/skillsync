import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router'; // Import Routes

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Import AppComponent and other components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseCatalogComponent } from './course-catalog/course-catalog.component';
import { CourseRatingComponent } from './components/course-rating/course-rating.component';
// ... import other components as needed

// Define routes
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'courses', component: CourseCatalogComponent },
  // ... add other routes as needed
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CourseCatalogComponent,
    CourseRatingComponent,
    // ... declare other components
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes), // Add this line to set up routing
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    // ... other modules
  ],
  providers: [
    // ... your providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }