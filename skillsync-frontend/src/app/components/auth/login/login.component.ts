import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlingService } from '../../../services/error-handling.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  rememberMe: boolean = false;
  twoFactorForm: FormGroup;
  showTwoFactorForm: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandlingService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.twoFactorForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.cdr.markForCheck();
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.requiresTwoFactor) {
            this.showTwoFactorForm = true;
          } else {
            this.handleSuccessfulLogin();
          }
          this.cdr.markForCheck();
        },
        error: (error: any) => {
          this.isLoading = false;
          if (error.message === 'RATE_LIMIT_EXCEEDED') {
            this.errorHandler.handleError(error, 'LOGIN.RATE_LIMIT_EXCEEDED');
          } else if (error.message === 'INVALID_CREDENTIALS') {
            this.errorHandler.handleError(error, 'LOGIN.INVALID_CREDENTIALS');
          } else {
            this.errorHandler.handleError(error, 'LOGIN.UNKNOWN_ERROR');
          }
          this.cdr.markForCheck();
        }
      });
    } else {
      this.errorHandler.handleError({ message: 'LOGIN.FILL_ALL_FIELDS' }, 'LOGIN.FILL_ALL_FIELDS');
    }
  }

  verifyTwoFactor() {
    if (this.twoFactorForm.valid) {
      this.isLoading = true;
      this.cdr.markForCheck();
      this.authService.verifyTwoFactor(this.twoFactorForm.get('code')?.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.handleSuccessfulLogin();
          this.cdr.markForCheck();
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorHandler.handleError(error, 'LOGIN.INVALID_VERIFICATION_CODE');
          this.cdr.markForCheck();
        }
      });
    }
  }

  googleLogin() {
    this.socialLogin(GoogleLoginProvider.PROVIDER_ID);
  }

  facebookLogin() {
    this.socialLogin(FacebookLoginProvider.PROVIDER_ID);
  }

  private socialLogin(providerId: string) {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.authService.socialLogin(providerId).subscribe({
      next: () => {
        this.isLoading = false;
        this.handleSuccessfulLogin();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorHandler.handleError(error, 'LOGIN.SOCIAL_LOGIN_ERROR');
        this.cdr.markForCheck();
      }
    });
  }

  private handleSuccessfulLogin() {
    this.errorHandler.showSuccessMessage('LOGIN.SUCCESS');
    this.router.navigate(['/dashboard']);
  }

  private showErrorMessage(messageKey: string) {
    this.translate.get(messageKey).subscribe((res: string) => {
      this.snackBar.open(res, this.translate.instant('COMMON.CLOSE'), {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    });
  }

  private showSuccessMessage(messageKey: string) {
    this.translate.get(messageKey).subscribe((res: string) => {
      this.snackBar.open(res, this.translate.instant('COMMON.CLOSE'), {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }
}