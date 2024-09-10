import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); // Adjust the URL to match your backend
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
  onCourseUpdate() {
    return this.listen('courseUpdate');
  }
  onCourseEnrollment() {
    return this.listen('courseEnrollment');
  }
  onCourseCompletion() {
    return this.listen('courseCompletion');
  }
}