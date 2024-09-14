import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { switchMap } from 'rxjs/operators';

interface AuthResponse {
  token: string;
  expiresIn: number;
  role: string;
  requiresTwoFactor?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenTimeout: any;

  constructor(private http: HttpClient, private socialAuthService: SocialAuthService) {
    this.checkTokenExpiration();
  }

  // Public methods

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (!response.requiresTwoFactor) {
          this.handleSuccessfulAuth(response);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error && error.error.message === 'Invalid credentials') {
          return throwError(() => new Error('ERRORS.INVALID_CREDENTIALS'));
        }
        return throwError(() => error);
      })
    );
  }

  logout2(): void {
    this.clearAuthData();
    this.stopRefreshTokenTimer();
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh-token`, {}).pipe(
      tap(response => this.handleSuccessfulAuth(response)),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isAdmin(): boolean {
    // Implement your logic to check if the logged-in user is an admin
    // This might involve checking a role stored in localStorage or making an API call
    return this.isLoggedIn() && localStorage.getItem('userRole') === 'ADMIN';
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`);
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile`, userData).pipe(
      tap(updatedUser => {
        this.storeUser(updatedUser);
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/change-password`, passwordData);
  }

  updateUserPreferences(preferences: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/preferences`, preferences);
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id;
    }
    return null;
  }

  getUserRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  hasRole(role: string): boolean {
    return this.userRoleSubject.value === role;
  }

  enableTwoFactor(): Observable<{ secret: string, qrCodeUrl: string }> {
    return this.http.post<{ secret: string, qrCodeUrl: string }>(`${this.apiUrl}/auth/enable-2fa`, {});
  }

  verifyTwoFactorSetup(code: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/auth/verify-2fa-setup`, { code });
  }

  disableTwoFactor(): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/auth/disable-2fa`, {});
  }

  verifyTwoFactor(code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/verify-2fa`, { code }).pipe(
      tap(response => this.handleSuccessfulAuth(response))
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/request-password-reset`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      catchError((error) => {
        if (error.error && error.error.message === 'Invalid credentials') {
          return throwError(() => new Error('ERRORS.INVALID_CREDENTIALS'));
        }
        return throwError(() => error);
      })
    );
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-email`, { token });
  }

  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/resend-verification`, { email });
  }

  refreshCsrfToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/csrf-token`, { withCredentials: true });
  }

  socialLogin(provider: string): Observable<any> {
    return from(this.socialAuthService.signIn(provider)).pipe(
      switchMap((socialUser: SocialUser) => {
        return this.http.post<any>(`${this.apiUrl}/social-login`, {
          provider: socialUser.provider,
          token: socialUser.idToken
        }).pipe(
          tap(response => this.handleSuccessfulAuth(response))
        );
      })
    );
  }

  googleLogin(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/google`).pipe(
      tap((response: AuthResponse) => this.setSession(response))
    );
  }
  
  facebookLogin(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/facebook`).pipe(
      tap((response: AuthResponse) => this.setSession(response))
    );
  }
  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  isLoggedIn() {
    return Date.now() < this.getExpiration();
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    return expiration ? JSON.parse(expiration) : 0;
  }

  // Private methods

  private handleSuccessfulAuth(authResult: AuthResponse): void {
    this.setSession(authResult);
    this.refreshCsrfToken().subscribe();
  }

  private setSession(authResult: AuthResponse): void {
    const expiresAt = new Date().getTime() + authResult.expiresIn * 1000;
    this.storeToken(authResult.token);
    this.storeTokenExpiration(expiresAt);
    this.storeUserRole(authResult.role);
    this.tokenSubject.next(authResult.token);
    this.userRoleSubject.next(authResult.role);
    this.startRefreshTokenTimer();
  }

  private startRefreshTokenTimer(): void {
    const expires = this.getTokenExpiration();
    const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }

  private getTokenExpiration(): Date {
    const expiration = sessionStorage.getItem('tokenExpiration');
    const expiresAt = expiration ? parseInt(expiration, 10) : 0;
    return new Date(expiresAt);
  }

  private checkTokenExpiration(): void {
    const expires = this.getTokenExpiration();
    if (new Date() > expires) {
      this.logout();
    } else {
      this.startRefreshTokenTimer();
    }
  }

  private handleLoginError(error: HttpErrorResponse) {
    if (error.status === 429) {
      return throwError(() => new Error('RATE_LIMIT_EXCEEDED'));
    } else if (error.status === 401) {
      return throwError(() => new Error('INVALID_CREDENTIALS'));
    }
    return throwError(() => new Error('UNKNOWN_ERROR'));
  }

  private clearAuthData(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('tokenExpiration');
    sessionStorage.removeItem('userRole');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.userRoleSubject.next(null);
  }

  private getStoredToken(): string | null {
    return sessionStorage.getItem('token');
  }

  private getStoredUser(): any {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  private storeToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  private storeTokenExpiration(expiresAt: number): void {
    sessionStorage.setItem('tokenExpiration', expiresAt.toString());
  }

  private storeUserRole(role: string): void {
    sessionStorage.setItem('userRole', role);
  }

  private storeUser(user: any): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  enable2FA(): Observable<any> {
    return this.http.post(`${this.apiUrl}/enable-2fa`, {});
  }

  disable2FA(): Observable<any> {
    return this.http.post(`${this.apiUrl}/disable-2fa`, {});
  }

  verify2FA(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-2fa`, { token });
  }

  is2FAEnabled(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/2fa-status`);
  }
}