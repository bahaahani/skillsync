import { Component, Input, OnInit } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-forum',
  template: `
    <div class="forum">
      <h2>{{ 'FORUM.TITLE' | translate }}</h2>
      <div *ngFor="let thread of threads">
        <h3>{{ thread.title }}</h3>
        <p>{{ thread.content }}</p>
        <button (click)="loadComments(thread._id)">{{ 'FORUM.VIEW_COMMENTS' | translate }}</button>
      </div>
      <button (click)="showNewThreadForm = true">{{ 'FORUM.NEW_THREAD' | translate }}</button>
      <form *ngIf="showNewThreadForm" (ngSubmit)="createNewThread()">
        <input [(ngModel)]="newThread.title" name="title" placeholder="{{ 'FORUM.THREAD_TITLE' | translate }}">
        <textarea [(ngModel)]="newThread.content" name="content" placeholder="{{ 'FORUM.THREAD_CONTENT' | translate }}"></textarea>
        <button type="submit">{{ 'FORUM.SUBMIT' | translate }}</button>
      </form>
    </div>
  `
})
export class ForumComponent implements OnInit {
  @Input() courseId: string;
  threads: any[] = [];
  showNewThreadForm = false;
  newThread = { title: '', content: '' };

  constructor(
    private forumService: ForumService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadThreads();
  }

  loadThreads() {
    this.forumService.getThreads(this.courseId).subscribe(
      data => this.threads = data,
      error => this.errorHandler.handleError(error, 'FORUM.LOAD_ERROR')
    );
  }

  createNewThread() {
    this.forumService.createThread(this.courseId, this.newThread.title, this.newThread.content).subscribe(
      () => {
        this.loadThreads();
        this.showNewThreadForm = false;
        this.newThread = { title: '', content: '' };
      },
      error => this.errorHandler.handleError(error, 'FORUM.CREATE_THREAD_ERROR')
    );
  }

  loadComments(threadId: string) {
    // Implement comment loading logic
  }
}