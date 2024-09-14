import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appA11yImprovements]'
})
export class A11yImprovementsDirective implements OnInit {
  @Input() ariaLabel: string;
  @Input() role: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.ariaLabel) {
      this.el.nativeElement.setAttribute('aria-label', this.ariaLabel);
    }
    if (this.role) {
      this.el.nativeElement.setAttribute('role', this.role);
    }
    this.improveContrast();
    this.ensureKeyboardFocusable();
  }

  private improveContrast() {
    const currentColor = getComputedStyle(this.el.nativeElement).color;
    const currentBg = getComputedStyle(this.el.nativeElement).backgroundColor;
    // Implement logic to improve contrast if needed
  }

  private ensureKeyboardFocusable() {
    if (!this.el.nativeElement.getAttribute('tabindex')) {
      this.el.nativeElement.setAttribute('tabindex', '0');
    }
  }
}