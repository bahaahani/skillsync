import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  setFocus(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    }
  }

  announceForScreenReader(message: string): void {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('sr-only');
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }

  addSkipLink(targetId: string): void {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = 'Skip to main content';
    skipLink.classList.add('skip-link');
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}