import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTouchFriendly]'
})
export class TouchFriendlyDirective {
  @Input() touchClass: string = 'touch-active';

  constructor(private el: ElementRef) {}

  @HostListener('touchstart') onTouchStart() {
    this.el.nativeElement.classList.add(this.touchClass);
  }

  @HostListener('touchend') onTouchEnd() {
    this.el.nativeElement.classList.remove(this.touchClass);
  }

  @HostListener('touchcancel') onTouchCancel() {
    this.el.nativeElement.classList.remove(this.touchClass);
  }
}