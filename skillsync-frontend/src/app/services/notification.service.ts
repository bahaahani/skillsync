import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket;
  private notifications = new BehaviorSubject<Notification[]>([]);

  constructor() {
    this.socket = io(environment.apiUrl);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('notification', (notification: Notification) => {
      const currentNotifications = this.notifications.value;
      this.notifications.next([...currentNotifications, notification]);
    });
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  markAsRead(notificationId: string): void {
    // Implement logic to mark notification as read
    // This might involve sending a request to the server
    // and updating the local notifications array
  }

  clearNotifications(): void {
    this.notifications.next([]);
  }
}