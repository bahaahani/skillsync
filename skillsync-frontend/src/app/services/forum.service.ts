import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = 'http://localhost:3000/api/forum';

  constructor(private http: HttpClient) { }

  getAllPosts(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/posts?page=${page}&pageSize=${pageSize}`);
  }

  getPost(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/posts/${id}`);
  }

  createPost(post: { content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, post);
  }

  createTopic(topic: { title: string, content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/topics`, topic);
  }

  addReply(postId: string, reply: { content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts/${postId}/replies`, reply);
  }

  // Add other methods as needed
}