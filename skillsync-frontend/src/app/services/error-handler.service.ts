import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: Error | HttpErrorResponse) {
    let errorMessage: string;

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        errorMessage = 'No Internet Connection';
      } else {
        // Http Error
        errorMessage = `${error.status} - ${error.message}`;
      }
    } else {
      // Client Error
      errorMessage = error.message ? error.message : error.toString();
    }

    this.showErrorMessage(errorMessage);
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}