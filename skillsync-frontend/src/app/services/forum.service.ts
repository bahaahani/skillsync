import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  constructor(private http: HttpClient, private apiService: ApiService) { }

  getAllPosts(): Observable<any> {
    return this.http.get(`${this.apiService.apiUrl}/forum`);
  }

  createPost(postData: any): Observable<any> {
    return this.http.post(`${this.apiService.apiUrl}/forum`, postData);
  }

  getPost(id: string): Observable<any> {
    return this.http.get(`${this.apiService.apiUrl}/forum/${id}`);
  }

  addReply(postId: string, replyData: any): Observable<any> {
    return this.http.post(`${this.apiService.apiUrl}/forum/${postId}/reply`, replyData);
  }
}