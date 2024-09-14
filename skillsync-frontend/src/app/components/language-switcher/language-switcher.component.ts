import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  template: `
    <mat-select [(value)]="currentLang" (selectionChange)="changeLang($event.value)">
      <mat-option *ngFor="let lang of languages" [value]="lang.code">
        {{ lang.name }}
      </mat-option>
    </mat-select>
  `
})
export class LanguageSwitcherComponent {
  currentLang: string;
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang;
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }
}