import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket(`${environment.wsUrl}/collaboration`);
  }

  joinProject(projectId: string, userId: string) {
    this.socket$.next({ type: 'join', projectId, userId });
  }

  leaveProject(projectId: string, userId: string) {
    this.socket$.next({ type: 'leave', projectId, userId });
  }

  sendUpdate(projectId: string, userId: string, update: any) {
    this.socket$.next({ type: 'update', projectId, userId, update });
  }

  getUpdates() {
    return this.socket$.asObservable();
  }
}