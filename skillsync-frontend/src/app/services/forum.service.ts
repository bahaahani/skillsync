import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = `${environment.apiUrl}/forum`;

  constructor(private http: HttpClient) {}

  getThreads(page: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/threads`, { params: { page: page.toString(), pageSize: pageSize.toString() } });
  }

  createThread(thread: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/threads`, thread);
  }

  createPost(post: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, post);
  }
}