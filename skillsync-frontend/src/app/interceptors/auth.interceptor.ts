import { Injectable } from '@angular/core';
import { 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor, 
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip adding token for certain endpoints
    if (this.isPublicRequest(request)) {
      return next.handle(request);
    }

    // Add token to request
    request = this.addTokenToRequest(request, this.authService.getToken());

    // Handle the response
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Try to refresh token if 401 (Unauthorized)
          return this.handle401Error(request, next);
        }
        
        // For other errors, propagate the error
        return throwError(() => error);
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string | null): HttpRequest<any> {
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  }

  private isPublicRequest(request: HttpRequest<any>): boolean {
    const apiUrl = environment.apiUrl;
    const publicPaths = [
      `${apiUrl}/auth/login`,
      `${apiUrl}/auth/register`,
      `${apiUrl}/auth/refresh-token`
    ];
    
    // Check if the request URL is in the list of public paths
    return publicPaths.some(path => request.url.includes(path));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If we're already refreshing, wait until the refresh completes
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next.handle(this.addTokenToRequest(request, token));
        })
      );
    }

    // Start token refresh process
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    // Attempt to refresh the token
    return this.authService.refreshToken().pipe(
      switchMap(response => {
        this.refreshTokenSubject.next(response.accessToken);
        
        // Retry the original request with the new token
        return next.handle(this.addTokenToRequest(request, response.accessToken));
      }),
      catchError(error => {
        // If refresh fails, log out the user
        this.authService.logout();
        return throwError(() => error);
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }
}