import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
    notifications: Notification[] = [];
    private subscription: Subscription | undefined;

    constructor(private notificationService: NotificationService) {}

    ngOnInit() {
        this.loadNotifications();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadNotifications() {
        this.subscription = this.notificationService.getNotifications().subscribe(
            (notifications) => {
                this.notifications = notifications;
            },
            (error) => {
                console.error('Error loading notifications:', error);
            }
        );
    }

    markAsRead(notificationId: string) {
        this.notificationService.markAsRead(notificationId);
    }

    clearNotifications() {
        this.notificationService.clearNotifications();
    }
}