import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: { [key: string]: { data: any; timestamp: number } } = {};
  private readonly MAX_AGE = 5 * 60 * 1000; // 5 minutes

  constructor() { }

  set(key: string, data: any): void {
    this.cache[key] = {
      data: data,
      timestamp: Date.now()
    };
  }

  get(key: string): any | null {
    const cached = this.cache[key];
    if (!cached) {
      return null;
    }

    const age = Date.now() - cached.timestamp;
    if (age > this.MAX_AGE) {
      delete this.cache[key];
      return null;
    }

    return cached.data;
  }

  clear(key?: string): void {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }
}