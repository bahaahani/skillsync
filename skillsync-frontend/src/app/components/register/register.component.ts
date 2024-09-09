import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styles: [`
    .register-container {
      max-width: 300px;
      margin: 0 auto;
      padding: 20px;
    }
    .error {
      color: red;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.authService.register({ username, email, password }).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          console.error('Registration error', err);
          this.error = 'Registration failed. Please try again.';
        }
      });
    }
  }
}