import { Component, OnInit } from '@angular/core';
import { ForumService } from '../services/forum.service';
import { ErrorHandlingService } from '../services/error-handling.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  posts: any[] = [];
  newTopic: any = { title: '', content: '' };
  newPost: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(
    private forumService: ForumService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.forumService.getThreads(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        this.posts = response.posts;
        this.totalPages = response.totalPages;
      },
      error => this.errorHandler.handleError(error, 'FORUM.LOAD_ERROR')
    );
  }

  createTopic() {
    this.forumService.createThread(this.newTopic).subscribe(
      () => {
        this.loadPosts();
        this.newTopic = { title: '', content: '' };
      },
      error => this.errorHandler.handleError(error, 'FORUM.CREATE_TOPIC_ERROR')
    );
  }

  submitPost() {
    this.forumService.createPost({ content: this.newPost }).subscribe(
      () => {
        this.loadPosts();
        this.newPost = '';
      },
      error => this.errorHandler.handleError(error, 'FORUM.SUBMIT_POST_ERROR')
    );
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadPosts();
    }
  }
}
