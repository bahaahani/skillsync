import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForumService } from '../../services/forum.service';

@Component({
  selector: 'app-forum-posts',
  templateUrl: './forum-posts.component.html',
  styleUrls: ['./forum-posts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForumPostsComponent implements OnInit {
  courseId: string;
  topicId: string;
  posts: any[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private cdr: ChangeDetectorRef
  ) {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.topicId = this.route.snapshot.paramMap.get('topicId') || '';
  }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading = true;
    this.forumService.getForumPosts(this.courseId, this.topicId).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  createPost(content: string) {
    const newPost = { content };
    this.forumService.createForumPost(this.courseId, this.topicId, newPost).subscribe({
      next: (createdPost) => {
        this.posts.push(createdPost);
        this.cdr.markForCheck();
      }
    });
  }
}