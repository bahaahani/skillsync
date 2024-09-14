import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MonitoringService } from './monitoring.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private monitoringService: MonitoringService
  ) {}

  handleError(error: any, messageKey: string) {
    console.error('An error occurred:', error);
    this.showErrorMessage(messageKey);
    this.monitoringService.logError({ error, messageKey });
  }

  showErrorMessage(messageKey: string) {
    this.translate.get(messageKey).subscribe((message: string) => {
      this.snackBar.open(message, this.translate.instant('COMMON.CLOSE'), {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    });
  }

  showSuccessMessage(messageKey: string) {
    this.translate.get(messageKey).subscribe((message: string) => {
      this.snackBar.open(message, this.translate.instant('COMMON.CLOSE'), {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }
}