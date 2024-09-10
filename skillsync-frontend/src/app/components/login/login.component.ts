import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  error: string = ''; // Add this line to fix the error property

  constructor(private apiService: ApiService) {}

  onSubmit() {
    this.apiService.login(this.credentials).subscribe(
      response => {
        console.log('Login successful', response);
        // Handle successful login (e.g., store token, redirect)
      },
      error => {
        console.error('Login failed', error);
        this.error = 'Login failed. Please check your credentials.'; // Set error message
      }
    );
  }
}