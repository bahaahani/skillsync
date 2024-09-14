import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-course-forum',
  template: `
    <div class="course-forum">
      <h2>{{ 'COURSES.FORUM' | translate }}</h2>
      <div class="forum-posts">
        <div *ngFor="let thread of forumThreads" class="forum-thread">
          <h3>{{ thread.title }}</h3>
          <p>{{ thread.content }}</p>
          <p>{{ 'COURSES.BY' | translate }}: {{ thread.username }}</p>
          <p>{{ thread.createdAt | date }}</p>
          <button (click)="toggleReplies(thread)">
            {{ thread.showReplies ? ('COURSES.HIDE_REPLIES' | translate) : ('COURSES.SHOW_REPLIES' | translate) }}
          </button>
          <div *ngIf="thread.showReplies">
            <div *ngFor="let reply of thread.replies" class="forum-reply">
              <p>{{ reply.content }}</p>
              <p>{{ 'COURSES.BY' | translate }}: {{ reply.username }}</p>
              <p>{{ reply.createdAt | date }}</p>
            </div>
            <form [formGroup]="replyForm" (ngSubmit)="submitReply(thread._id)">
              <mat-form-field>
                <textarea matInput formControlName="content" placeholder="{{ 'COURSES.WRITE_REPLY' | translate }}"></textarea>
              </mat-form-field>
              <button mat-raised-button color="primary" type="submit" [disabled]="replyForm.invalid">
                {{ 'COURSES.SUBMIT_REPLY' | translate }}
              </button>
            </form>
          </div>
        </div>
      </div>
      <form [formGroup]="threadForm" (ngSubmit)="submitThread()">
        <mat-form-field>
          <input matInput formControlName="title" placeholder="{{ 'COURSES.THREAD_TITLE' | translate }}">
        </mat-form-field>
        <mat-form-field>
          <textarea matInput formControlName="content" placeholder="{{ 'COURSES.WRITE_POST' | translate }}"></textarea>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="threadForm.invalid">
          {{ 'COURSES.SUBMIT_THREAD' | translate }}
        </button>
      </form>
    </div>
  `
})
export class CourseForumComponent implements OnInit {
  courseId: string;
  forumThreads: any[] = [];
  threadForm: FormGroup;
  replyForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlingService
  ) {
    this.threadForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
    this.replyForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadForumThreads();
  }

  loadForumThreads() {
    this.courseService.getForumThreads(this.courseId).subscribe(
      data => {
        this.forumThreads = data.map(thread => ({ ...thread, showReplies: false }));
      },
      error => this.errorHandler.handleError(error, 'COURSES.FORUM_LOAD_ERROR')
    );
  }

  submitThread() {
    if (this.threadForm.valid) {
      this.courseService.createForumThread(this.courseId, this.threadForm.value).subscribe(
        () => {
          this.loadForumThreads();
          this.threadForm.reset();
          this.errorHandler.showSuccessMessage('COURSES.THREAD_SUBMITTED');
        },
        error => this.errorHandler.handleError(error, 'COURSES.THREAD_SUBMIT_ERROR')
      );
    }
  }

  submitReply(threadId: string) {
    if (this.replyForm.valid) {
      this.courseService.createForumReply(this.courseId, threadId, this.replyForm.value.content).subscribe(
        () => {
          this.loadForumThreads();
          this.replyForm.reset();
          this.errorHandler.showSuccessMessage('COURSES.REPLY_SUBMITTED');
        },
        error => this.errorHandler.handleError(error, 'COURSES.REPLY_SUBMIT_ERROR')
      );
    }
  }

  toggleReplies(thread: any) {
    thread.showReplies = !thread.showReplies;
  }
}