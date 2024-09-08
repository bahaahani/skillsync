import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ForumService } from '../../services/forum.service';

@Component({
  selector: 'app-topic-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topic-view.component.html',
  styleUrls: ['./topic-view.component.css']
})
export class TopicViewComponent implements OnInit {
  post: any;
  replyContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
    }
  }

  loadPost(id: string) {
    this.forumService.getPost(id).subscribe({
      next: (data) => {
        this.post = data;
      },
      error: (error) => {
        console.error('Error fetching post:', error);
      }
    });
  }

  addReply() {
    if (this.replyContent.trim()) {
      this.forumService.addReply(this.post._id, { content: this.replyContent }).subscribe({
        next: (updatedPost) => {
          this.post = updatedPost;
          this.replyContent = '';
        },
        error: (error) => {
          console.error('Error adding reply:', error);
        }
      });
    }
  }
}