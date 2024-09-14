import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudyGroupService {
  private apiUrl = `${environment.apiUrl}/study-groups`;

  constructor(private http: HttpClient) {}

  createStudyGroup(groupData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, groupData);
  }

  getStudyGroups(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/course/${courseId}`);
  }

  joinStudyGroup(groupId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/join`, {});
  }

  leaveStudyGroup(groupId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/leave`, {});
  }

  sendMessage(groupId: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/messages`, { message });
  }

  getMessages(groupId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${groupId}/messages`);
  }
}