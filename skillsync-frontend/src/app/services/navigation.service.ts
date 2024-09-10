import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private currentRouteSubject = new BehaviorSubject<string>('');
  currentRoute$ = this.currentRouteSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRouteSubject.next(event.urlAfterRedirects);
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isRouteActive(route: string): boolean {
    return this.currentRouteSubject.value.startsWith(route);
  }
}