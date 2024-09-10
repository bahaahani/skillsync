import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl, {
      withCredentials: true,
      autoConnect: false
    });
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinCourse(courseId: string) {
    this.socket.emit('joinCourse', courseId);
  }

  joinAdminRoom(token: string) {
    this.socket.emit('joinAdminRoom', token);
  }

  joinInstructorRoom(token: string) {
    this.socket.emit('joinInstructorRoom', token);
  }

  sendChatMessage(data: { senderId: string, recipientId: string, content: string }) {
    this.socket.emit('chatMessage', data);
  }

  onChatMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('chatMessage', (data) => observer.next(data));
    });
  }

  onCourseUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('courseUpdate', (data) => observer.next(data));
    });
  }
}