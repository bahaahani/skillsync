import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private readonly cdnUrl = environment.cdnUrl;

  optimizeImageUrl(url: string, width: number = 800, quality: number = 80): string {
    return `${this.cdnUrl}/image/resize?url=${encodeURIComponent(url)}&width=${width}&quality=${quality}`;
  }

  preloadImage(url: string): void {
    const img = new Image();
    img.src = this.optimizeImageUrl(url);
  }

  lazyLoadImage(element: HTMLImageElement, src: string): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          element.src = this.optimizeImageUrl(src);
          observer.unobserve(element);
        }
      });
    });
    observer.observe(element);
  }
}