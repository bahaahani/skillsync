import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserSettingsComponent } from './components/user/user-settings/user-settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, UserSettingsComponent],
  template: `
    <app-user-settings (darkModeChanged)="onDarkModeChanged($event)"></app-user-settings>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'skillsync-frontend';

  constructor(private renderer: Renderer2) {}

  onDarkModeChanged(isDarkMode: boolean) {
    if (isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }
}
