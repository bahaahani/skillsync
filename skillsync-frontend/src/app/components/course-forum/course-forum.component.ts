import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-course-forum',
  templateUrl: './course-forum.component.html',
  styleUrls: ['./course-forum.component.css']
})
export class CourseForumComponent implements OnInit {
  @Input() courseId!: string;
  threads: any[] = [];
  newThreadForm: FormGroup;
  replyForms: { [key: string]: FormGroup } = {};
  isLoading = false;
  errorMessage: string = '';
  newPost: string = '';
  showAddPost = false;
  error: string = '';
  posts: any[] = [];
  apiUrl = environment.apiUrl;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService,
    private http: HttpClient
  ) {
    this.newThreadForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadThreads();
  }

  createPost(): void {
    if (this.newPost.trim()) {
      this.courseService.createForumPost(this.courseId, this.newPost).subscribe(
        () => {
          this.newPost = '';
          this.loadThreads();
        },
        (error: any) => {
          this.errorHandler.handleError(error, 'Error creating post');
        }
      );
    }
  }

  loadThreads(): void {
    this.courseService.getForumThreads(this.courseId).subscribe(
      (data: any[]) => {
        this.threads = data.map((thread: any) => ({ ...thread, showReplies: false }));
      },
      (error: any) => {
        this.errorHandler.handleError(error, 'Error loading forum threads');
      }
    );
  }

  createThread(): void {
    if (this.newThreadForm.valid) {
      this.courseService.createForumThread(this.courseId, this.newThreadForm.value).subscribe(
        () => {
          this.newThreadForm.reset();
          this.loadThreads();
        },
        (error: any) => {
          this.errorHandler.handleError(error, 'Error creating thread');
        }
      );
    }
  }

  createReply(threadId: string): void {
    const replyForm = this.replyForms[threadId];
    if (replyForm && replyForm.valid) {
      this.courseService.createForumReply(this.courseId, threadId, replyForm.value).subscribe(
        () => {
          replyForm.reset();
          this.loadThreads();
        },
        (error: any) => {
          this.errorHandler.handleError(error, 'Error creating reply');
        }
      );
    }
  }

  toggleReplies(thread: any): void {
    thread.showReplies = !thread.showReplies;
    if (thread.showReplies && !this.replyForms[thread._id]) {
      this.replyForms[thread._id] = this.formBuilder.group({
        content: ['', Validators.required]
      });
    }
  }

  createForumPost(courseId: string, content: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courseId}/forum`, { content });
  }
}