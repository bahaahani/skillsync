import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" required>
              <mat-error *ngIf="registerForm.controls['username'].errors?.['required']">
                Username is required
              </mat-error>
              <mat-error *ngIf="registerForm.controls['username'].errors?.['minlength']">
                Username must be at least 3 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="registerForm.controls['email'].errors?.['required']">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.controls['email'].errors?.['email']">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" required>
              <mat-error *ngIf="registerForm.controls['password'].errors?.['required']">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.controls['password'].errors?.['pattern']">
                Password must be at least 8 characters long and include uppercase, lowercase, and numbers
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput formControlName="confirmPassword" type="password" required>
              <mat-error *ngIf="registerForm.controls['confirmPassword'].errors?.['required']">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="registerForm.errors?.['passwordMismatch']">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <div formGroupName="personalInfo">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName">
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName">
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || isSubmitting">
                <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
                <span *ngIf="!isSubmitting">Register</span>
              </button>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <div class="login-link">
            Already have an account? <a routerLink="/login">Login</a>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      min-height: calc(100vh - 64px);
    }
    
    .register-card {
      max-width: 500px;
      width: 100%;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    
    .half-width {
      width: 48%;
      margin-right: 2%;
      margin-bottom: 15px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    .login-link {
      text-align: center;
      margin: 10px 0;
    }
    
    button {
      min-width: 120px;
    }
  `],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      personalInfo: this.fb.group({
        firstName: [''],
        lastName: ['']
      })
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  ngOnInit(): void {}

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const formValues = this.registerForm.value;
    
    const userData = {
      username: formValues.username,
      email: formValues.email,
      password: formValues.password,
      firstName: formValues.personalInfo.firstName,
      lastName: formValues.personalInfo.lastName
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.snackBar.open('Registration successful! Redirecting to login...', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.snackBar.open(error.message || 'Registration failed. Please try again.', 'Close', {
          duration: 5000
        });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}