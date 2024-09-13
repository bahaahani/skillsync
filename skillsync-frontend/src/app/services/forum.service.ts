import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlingService } from './error-handling.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = `${environment.apiUrl}/forums`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

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

  getForumTopics(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/topics`).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'FORUM.FETCH_TOPICS_ERROR');
        throw error;
      })
    );
  }

  getForumPosts(courseId: string, topicId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/topics/${topicId}/posts`).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'FORUM.FETCH_POSTS_ERROR');
        throw error;
      })
    );
  }

  createForumTopic(courseId: string, topic: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/topics`, topic).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'FORUM.CREATE_TOPIC_ERROR');
        throw error;
      })
    );
  }

  createForumPost(courseId: string, topicId: string, post: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/topics/${topicId}/posts`, post).pipe(
      catchError(error => {
        this.errorHandler.handleError(error, 'FORUM.CREATE_POST_ERROR');
        throw error;
      })
    );
  }

  // Add other methods as needed
}