import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      // Not logged in, redirect to login page with return URL
      return this.router.createUrlTree(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
    }

    // Check if route has any role requirements
    const requiredRoles = route.data['roles'] as string[];
    
    if (requiredRoles && requiredRoles.length > 0) {
      // Role requirements found, check if user has any of the required roles
      if (!this.authService.hasRole(requiredRoles)) {
        // User doesn't have required roles, redirect to unauthorized page
        return this.router.createUrlTree(['/unauthorized']);
      }
    }

    // User is authenticated and has required roles (if any)
    return true;
  }
}