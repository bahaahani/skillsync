import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  handleError(error: any, messageKey: string) {
    this.translate.get(messageKey).subscribe((res: string) => {
      this.snackBar.open(res, this.translate.instant('COMMON.CLOSE'), {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    });
  }

  showSuccessMessage(messageKey: string) {
    this.translate.get(messageKey).subscribe((res: string) => {
      this.snackBar.open(res, this.translate.instant('COMMON.CLOSE'), {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }
}