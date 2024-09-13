import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Handle form submission
      console.log(this.loginForm.value);
    } else {
      this.errorHandler.showErrorMessage('LOGIN.FILL_ALL_FIELDS');
    }
  }

  loginWithGoogle() {
    // Implement Google login
    console.log('Google login');
  }

  loginWithFacebook() {
    // Implement Facebook login
    console.log('Facebook login');
  }
}