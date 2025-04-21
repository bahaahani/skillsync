import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseCatalogComponent } from './course-catalog/course-catalog.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseRatingComponent } from './components/course-rating/course-rating.component';
import { CourseReviewComponent } from './components/course-review/course-review.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Service providers
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { LoadingService } from './services/loading.service';
import { ErrorHandlerService } from './services/error-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    CourseCatalogComponent,
    CourseDetailsComponent,
    CourseRatingComponent,
    CourseReviewComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    UserProfileComponent,
    UnauthorizedComponent,
    LoadingIndicatorComponent,
  ],
  imports: [
    // Core modules
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    
    // Material modules
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatListModule,
    MatCheckboxModule,
    MatTabsModule,
    MatMenuModule,
    MatDividerModule,
  ],
  providers: [
    // HTTP Interceptors
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
    // Core services
    AuthService,
    ApiService,
    LoadingService,
    ErrorHandlerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }