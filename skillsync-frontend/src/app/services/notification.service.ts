import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

export interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private socket: Socket;

  constructor() {
    this.socket = io(environment.wsUrl);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('newNotification', (notification: Notification) => {
      const currentNotifications = this.notifications.value;
      this.notifications.next([...currentNotifications, notification]);
    });
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  addNotification(notification: Notification): void {
    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, notification]);
  }

  markAsRead(notificationId: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    this.notifications.next(updatedNotifications);
    this.socket.emit('markAsRead', notificationId);
  }

  clearNotifications(): void {
    this.notifications.next([]);
    this.socket.emit('clearNotifications');
  }
}