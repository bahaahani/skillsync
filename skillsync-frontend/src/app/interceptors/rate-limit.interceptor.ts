import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorHandlingService } from '../services/error-handling.service';

@Injectable()
export class RateLimitInterceptor implements HttpInterceptor {
  private requestCount: { [key: string]: number } = {};
  private readonly requestLimit = 100; // Adjust as needed
  private readonly timeWindow = 60000; // 1 minute

  constructor(private errorHandler: ErrorHandlingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const endpoint = request.url.split('?')[0]; // Remove query params
    if (!this.requestCount[endpoint]) {
      this.requestCount[endpoint] = 0;
    }

    if (this.requestCount[endpoint] >= this.requestLimit) {
      this.errorHandler.handleError(new Error('Rate limit exceeded'), 'ERRORS.RATE_LIMIT_EXCEEDED');
      return throwError(() => new Error('Rate limit exceeded'));
    }

    this.requestCount[endpoint]++;
    setTimeout(() => this.requestCount[endpoint]--, this.timeWindow);

    return next.handle(request);
  }
}