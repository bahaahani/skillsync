import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    const userData = {
      name: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.register(userData).subscribe({
      next: (response: any) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.error = 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      }
    });
  }
}