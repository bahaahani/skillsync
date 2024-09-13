import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent {
  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}