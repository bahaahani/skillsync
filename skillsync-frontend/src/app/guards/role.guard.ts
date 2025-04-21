import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree, 
  Router 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // First check if user is logged in
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
    }

    // Get required role from route data
    const requiredRole = route.data['role'] as string;
    
    // If no role specified, allow access
    if (!requiredRole) {
      return true;
    }

    // Check if user has the required role
    if (!this.authService.hasRole(requiredRole)) {
      // Redirect to unauthorized page if user doesn't have required role
      return this.router.createUrlTree(['/unauthorized']);
    }

    // User has required role, allow access
    return true;
  }
} 