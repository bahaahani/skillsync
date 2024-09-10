import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
    notifications: any[] = [];
    private subscription: Subscription;

    constructor(private notificationService: NotificationService) {
        this.subscription = new Subscription();
    }

    ngOnInit() {
        this.loadNotifications();
        this.subscribeToNewNotifications();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    loadNotifications() {
        this.notificationService.getNotifications().subscribe(
            (notifications) => {
                this.notifications = notifications;
            },
            (error) => console.error('Error loading notifications', error)
        );
    }

    subscribeToNewNotifications() {
        this.subscription.add(
            this.notificationService.newNotification$.subscribe(
                (notification) => {
                    this.notifications.unshift(notification);
                }
            )
        );
    }

    markAsRead(notificationId: string) {
        this.notificationService.markAsRead(notificationId).subscribe(
            () => {
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.read = true;
                }
            },
            (error) => console.error('Error marking notification as read', error)
        );
    }
}