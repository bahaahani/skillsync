import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForumService } from '../../services/forum.service';

@Component({
  selector: 'app-forum-topics',
  templateUrl: './forum-topics.component.html',
  styleUrls: ['./forum-topics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForumTopicsComponent implements OnInit {
  courseId: string;
  topics: any[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private cdr: ChangeDetectorRef
  ) {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
  }

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.isLoading = true;
    this.forumService.getForumTopics(this.courseId).subscribe({
      next: (topics: any) => {
        this.topics = topics;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  createTopic(title: string, content: string) {
    const newTopic = { title, content };
    this.forumService.createForumTopic(this.courseId, newTopic).subscribe({
      next: (createdTopic: any) => {
        this.topics.unshift(createdTopic);
        this.cdr.markForCheck();
      }
    });
  }
}