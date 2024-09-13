import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  handleError(error: any, defaultMessageKey: string = 'COMMON.ERROR'): void {
    console.error('An error occurred:', error);

    let messageKey: string;

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          messageKey = 'ERRORS.BAD_REQUEST';
          break;
        case 401:
          messageKey = 'ERRORS.UNAUTHORIZED';
          break;
        case 403:
          messageKey = 'ERRORS.FORBIDDEN';
          break;
        case 404:
          messageKey = 'ERRORS.NOT_FOUND';
          break;
        case 409:
          messageKey = 'ERRORS.CONFLICT';
          break;
        case 422:
          messageKey = 'ERRORS.UNPROCESSABLE_ENTITY';
          break;
        case 429:
          messageKey = 'ERRORS.TOO_MANY_REQUESTS';
          break;
        case 500:
          messageKey = 'ERRORS.SERVER_ERROR';
          break;
        default:
          messageKey = defaultMessageKey;
      }
    } else if (error instanceof Error) {
      messageKey = `ERRORS.${error.name.toUpperCase()}`;
    } else {
      messageKey = defaultMessageKey;
    }

    this.showErrorMessage(messageKey);
  }

  private showErrorMessage(messageKey: string): void {
    this.translate.get(messageKey).subscribe((message: string) => {
      this.snackBar.open(message, this.translate.instant('COMMON.CLOSE'), {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    });
  }

  showSuccessMessage(messageKey: string): void {
    this.translate.get(messageKey).subscribe((message: string) => {
      this.snackBar.open(message, this.translate.instant('COMMON.CLOSE'), {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }
}