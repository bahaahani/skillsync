import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    if (!value) {
      return null;
    }

    const upperCaseCharacters = /[A-Z]+/g;
    const lowerCaseCharacters = /[a-z]+/g;
    const numberCharacters = /[0-9]+/g;
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    const upperCaseCheck = upperCaseCharacters.test(value);
    const lowerCaseCheck = lowerCaseCharacters.test(value);
    const numberCheck = numberCharacters.test(value);
    const specialCheck = specialCharacters.test(value);

    const checks = [upperCaseCheck, lowerCaseCheck, numberCheck, specialCheck];
    const passedChecks = checks.filter(check => check).length;

    return passedChecks >= 3 ? null : { weakPassword: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.cdr.markForCheck();
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.translate.get('REGISTER.SUCCESS').subscribe((res: string) => {
            this.snackBar.open(res, this.translate.instant('COMMON.CLOSE'), { duration: 5000 });
          });
          this.router.navigate(['/login']);
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.isLoading = false;
          this.translate.get('REGISTER.FAILURE').subscribe((res: string) => {
            this.snackBar.open(res, this.translate.instant('COMMON.CLOSE'), { duration: 5000 });
          });
          this.cdr.markForCheck();
        }
      });
    }
  }
}