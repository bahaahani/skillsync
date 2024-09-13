import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService, Notification } from './services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];
  notifications: Notification[] = [];
  private notificationSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {
    this.notificationSubscription = this.notificationService.getNotifications()
      .subscribe(notifications => {
        this.notifications = notifications;
      });
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }

  markNotificationAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId);
  }

  clearNotifications() {
    this.notificationService.clearNotifications();
  }
}
