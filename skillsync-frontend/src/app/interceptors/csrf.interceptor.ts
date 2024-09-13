import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      // Add CSRF token to the request headers
      const csrfToken = this.getCsrfToken();
      if (csrfToken) {
        request = request.clone({
          setHeaders: {
            'X-CSRF-TOKEN': csrfToken
          }
        });
      }
    }
    return next.handle(request);
  }

  private getCsrfToken(): string | null {
    // Retrieve the CSRF token from a cookie or local storage
    // This implementation assumes the token is stored in a cookie named 'XSRF-TOKEN'
    const csrfCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
  }
}