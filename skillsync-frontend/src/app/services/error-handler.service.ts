import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private notificationService: NotificationService) {}

  handleError(error: Error | HttpErrorResponse) {
    let errorMessage: string;

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      errorMessage = error.error instanceof ErrorEvent 
        ? `Error: ${error.error.message}`
        : `Error Code: ${error.status}\nMessage: ${error.message}`;
    } else {
      // Client-side error
      errorMessage = error.message ? error.message : error.toString();
    }

    console.error(errorMessage);
    this.notificationService.showError(errorMessage);
  }
}