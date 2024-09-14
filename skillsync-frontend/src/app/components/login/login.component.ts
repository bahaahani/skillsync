import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlingService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  googleLogin() {
    this.socialLogin(GoogleLoginProvider.PROVIDER_ID);
  }

  facebookLogin() {
    this.socialLogin(FacebookLoginProvider.PROVIDER_ID);
  }

  loginWithLinkedIn() {
    this.socialLogin(LinkedInLoginProvider.PROVIDER_ID);
  }

  private socialLogin(providerId: string) {
    this.authService.socialLogin(providerId).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorHandler.handleError(error, 'LOGIN.SOCIAL_LOGIN_ERROR');
      }
    });
  }
}