import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust this to your backend URL
  private newNotificationSubject = new Subject<any>();
  private notificationSubject = new Subject<Notification>();

  constructor(
    private http: HttpClient,
    private websocketService: WebsocketService
  ) {
    this.setupWebsocket();
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/${notificationId}/read`, {});
  }

  get newNotification$() {
    return this.newNotificationSubject.asObservable();
  }

  get notifications$() {
    return this.notificationSubject.asObservable();
  }

  showSuccess(message: string) {
    this.notificationSubject.next({ message, type: 'success' });
  }

  showError(message: string) {
    this.notificationSubject.next({ message, type: 'error' });
  }

  showInfo(message: string) {
    this.notificationSubject.next({ message, type: 'info' });
  }

  private setupWebsocket() {
    this.websocketService.listen('newNotification').subscribe(
      (notification) => {
        this.newNotificationSubject.next(notification);
      }
    );
  }
}