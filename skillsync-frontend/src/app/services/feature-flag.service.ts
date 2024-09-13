import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface FeatureFlags {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private apiUrl = `${environment.apiUrl}/feature-flags`;
  private featureFlags = new BehaviorSubject<FeatureFlags>({});

  constructor(private http: HttpClient) {
    this.loadFeatureFlags();
  }

  private loadFeatureFlags(): void {
    this.http.get<FeatureFlags>(this.apiUrl).subscribe({
      next: (flags) => this.featureFlags.next(flags),
      error: (error) => console.error('Error loading feature flags:', error)
    });
  }

  isFeatureEnabled(featureName: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.featureFlags.subscribe({
        next: (flags) => {
          observer.next(flags[featureName] || false);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getFeatureFlags(): Observable<FeatureFlags> {
    return this.featureFlags.asObservable();
  }
}