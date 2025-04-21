import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, BehaviorSubject, Observable, throwError, catchError, switchMap, of, timer, finalize } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

interface AuthResponse {
  success: boolean;
  accessToken: string;
  user: any;
  message?: string;
}

interface TokenRefreshResponse {
  success: boolean;
  accessToken: string;
}

interface TokenPayload {
  id: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());
  private refreshTokenTimeout: any;
  private isRefreshing = false;

  // Make token and currentUser observables public
  public token$ = this.tokenSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check token validity on service initialization
    this.validateTokenOnInit();
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getStoredUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private validateTokenOnInit(): void {
    const token = this.getStoredToken();
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        
        if (isExpired) {
          // Token is expired, try to refresh
          this.refreshToken().subscribe({
            error: () => {
              // If refresh fails, log out
              this.logout();
            }
          });
        } else {
          // Token is valid, set up refresh timer
          this.startRefreshTokenTimer(decoded);
        }
      } catch (error) {
        // Invalid token format
        this.logout();
      }
    }
  }

  register(userData: { username: string; email: string; password: string; firstName?: string; lastName?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap(response => {
        if (response.success) {
          this.setAuthState(response);
        }
      }),
      catchError(this.handleError)
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          this.setAuthState(response);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    // Clear tokens from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    // Reset BehaviorSubjects
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    
    // Stop refresh timer
    this.stopRefreshTokenTimer();
    
    // Call logout API to invalidate refresh token
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe();
  }

  refreshToken(): Observable<TokenRefreshResponse> {
    if (this.isRefreshing) {
      // If already refreshing, wait for the current refresh to complete
      return this.token$.pipe(
        switchMap(token => {
          if (token) {
            return of({ success: true, accessToken: token } as TokenRefreshResponse);
          }
          return throwError(() => new Error('No token available'));
        })
      );
    }

    this.isRefreshing = true;

    // Send request to refresh token endpoint
    return this.http.post<TokenRefreshResponse>(`${this.apiUrl}/auth/refresh-token`, {}).pipe(
      tap(response => {
        if (response.success) {
          localStorage.setItem('access_token', response.accessToken);
          this.tokenSubject.next(response.accessToken);
          
          // Update token expiration timer
          const decoded = jwtDecode<TokenPayload>(response.accessToken);
          this.startRefreshTokenTimer(decoded);
        }
      }),
      catchError(error => {
        // If refresh fails, force logout
        this.logout();
        return throwError(() => error);
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  private setAuthState(response: AuthResponse): void {
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    this.tokenSubject.next(response.accessToken);
    this.currentUserSubject.next(response.user);
    
    // Set up token refresh timer
    const decoded = jwtDecode<TokenPayload>(response.accessToken);
    this.startRefreshTokenTimer(decoded);
  }

  private startRefreshTokenTimer(decodedToken: TokenPayload): void {
    // Clear any existing timer
    this.stopRefreshTokenTimer();
    
    // Calculate token expiry time (in milliseconds)
    const expiresAt = decodedToken.exp * 1000;
    
    // Refresh token 1 minute before it expires
    const timeout = expiresAt - Date.now() - (60 * 1000);
    
    // Set timer to refresh token before expiry
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, Math.max(0, timeout));
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`).pipe(
      catchError(this.handleError)
    );
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile`, userData).pipe(
      tap(updatedUser => {
        const currentUser = this.currentUserSubject.value;
        const newUser = { ...currentUser, ...updatedUser };
        
        localStorage.setItem('user', JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);
      }),
      catchError(this.handleError)
    );
  }

  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/change-password`, passwordData).pipe(
      catchError(this.handleError)
    );
  }

  updateUserPreferences(preferences: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/preferences`, preferences).pipe(
      catchError(this.handleError)
    );
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserId(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<TokenPayload>(token);
        return decodedToken.id;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  hasRole(roles: string | string[]): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return false;

    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    return currentUser.role === roles;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      // Server-side error with message
      errorMessage = error.error.message;
    } else if (error.status) {
      // Server-side error without specific message
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized. Please log in.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}