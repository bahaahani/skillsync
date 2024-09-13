import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-two-factor-settings',
  templateUrl: './two-factor-settings.component.html',
  styleUrls: ['./two-factor-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoFactorSettingsComponent implements OnInit {
  twoFactorEnabled = false;
  setupForm: FormGroup;
  qrCodeUrl: string | null = null;
  secret: string | null = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.setupForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {
    // Check if 2FA is already enabled for the user
    this.authService.getUserProfile().subscribe(profile => {
      this.twoFactorEnabled = profile.twoFactorEnabled;
      this.cdr.markForCheck();
    });
  }

  enableTwoFactor() {
    this.authService.enableTwoFactor().subscribe({
      next: (response) => {
        this.qrCodeUrl = response.qrCodeUrl;
        this.secret = response.secret;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.showErrorMessage('TWO_FACTOR.ENABLE_ERROR');
      }
    });
  }

  verifySetup() {
    if (this.setupForm.valid) {
      const code = this.setupForm.get('code')?.value;
      this.authService.verifyTwoFactorSetup(code).subscribe({
        next: (result) => {
          if (result) {
            this.twoFactorEnabled = true;
            this.showSuccessMessage('TWO_FACTOR.SETUP_SUCCESS');
          } else {
            this.showErrorMessage('TWO_FACTOR.INVALID_CODE');
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.showErrorMessage('TWO_FACTOR.SETUP_ERROR');
        }
      });
    }
  }

  disableTwoFactor() {
    this.authService.disableTwoFactor().subscribe({
      next: (result) => {
        if (result) {
          this.twoFactorEnabled = false;
          this.showSuccessMessage('TWO_FACTOR.DISABLED');
        } else {
          this.showErrorMessage('TWO_FACTOR.DISABLE_ERROR');
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.showErrorMessage('TWO_FACTOR.DISABLE_ERROR');
      }
    });
  }

  private showSuccessMessage(key: string) {
    this.translate.get(key).subscribe((res: string) => {
      this.snackBar.open(res, this.translate.instant('COMMON.CLOSE'), {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }

  private showErrorMessage(key: string) {
    this.translate.get(key).subscribe((res: string) => {
      this.snackBar.open(res, this.translate.instant('COMMON.CLOSE'), {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    });
  }
}