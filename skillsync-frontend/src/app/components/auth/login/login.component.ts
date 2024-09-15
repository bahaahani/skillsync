import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  twoFactorForm!: FormGroup;
  isLoading = false;
  showTwoFactorForm = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.twoFactorForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      // Implement login logic here
      // If 2FA is required, set showTwoFactorForm to true
    }
  }

  verifyTwoFactor() {
    if (this.twoFactorForm.valid) {
      this.isLoading = true;
      // Implement 2FA verification logic here
    }
  }

  googleLogin() {
    // Implement Google login logic
  }

  facebookLogin() {
    // Implement Facebook login logic
  }
}