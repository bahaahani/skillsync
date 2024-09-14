import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: { [key: string]: any } = {};

  set(key: string, data: any, ttl: number = 60000): void {
    const now = new Date();
    const item = {
      value: data,
      expiry: now.getTime() + ttl,
    };
    this.cache[key] = item;
  }

  get(key: string): any {
    const item = this.cache[key];
    if (!item) return null;

    const now = new Date();
    if (now.getTime() > item.expiry) {
      delete this.cache[key];
      return null;
    }
    return item.value;
  }

  clear(key?: string): void {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }
}