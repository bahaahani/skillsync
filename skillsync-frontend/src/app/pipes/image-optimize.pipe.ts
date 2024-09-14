import { Pipe, PipeTransform } from '@angular/core';
import { ImageOptimizationService } from '../services/image-optimization.service';

@Pipe({
  name: 'imageOptimize'
})
export class ImageOptimizePipe implements PipeTransform {
  constructor(private imageOptimizationService: ImageOptimizationService) {}

  transform(url: string, width?: number, quality?: number): string {
    return this.imageOptimizationService.optimizeImageUrl(url, width, quality);
  }
}