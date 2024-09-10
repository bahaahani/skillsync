import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { SocketService } from './services/socket.service';
import { AuthService } from './services/auth.service';
import { CourseService } from './services/course.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CourseListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    SocketService,
    AuthService,
    CourseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }