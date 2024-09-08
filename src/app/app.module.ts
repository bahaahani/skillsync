import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service'; // Adjust the path as necessary

@NgModule({
    declarations: [
        AppComponent,
        // other components
    ],
    imports: [
        BrowserModule,
        HttpClientModule, // Add HttpClientModule to imports
        // other modules
    ],
    providers: [AuthService], // Ensure AuthService is provided
    bootstrap: [AppComponent]
})
export class AppModule { }