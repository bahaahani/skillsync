import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(
    private swPush: SwPush,
    private http: HttpClient
  ) {}

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: environment.vapidPublicKey
    })
    .then(sub => this.sendSubscriptionToBackend(sub))
    .catch(err => console.error('Could not subscribe to notifications', err));
  }

  private sendSubscriptionToBackend(subscription: PushSubscription) {
    return this.http.post(`${this.apiUrl}/subscribe`, subscription).subscribe(
      () => console.log('Sent push subscription object to server'),
      err => console.error('Could not send subscription object to server', err)
    );
  }
}