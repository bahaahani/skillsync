import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      const newPassword = this.resetForm.get('password')?.value;
      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: () => {
          this.translate.get('PASSWORD_RESET.SUCCESS').subscribe((res: string) => {
            this.snackBar.open(res, this.translate.instant('COMMON.CLOSE'), { duration: 3000 });
          });
        },
        error: (error) => {
          this.translate.get('PASSWORD_RESET.FAILURE').subscribe((res: string) => {
            this.snackBar.open(res, this.translate.instant('COMMON.CLOSE'), { duration: 3000 });
          });
        }
      });
    }
  }
}