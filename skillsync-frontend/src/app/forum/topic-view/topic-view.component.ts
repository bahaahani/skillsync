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
  topic: any; // Define the topic property
  newReply: string = ''; // Define the newReply property

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
      next: (data: any) => {
        this.post = data;
        this.topic = data; // Assuming the post is the topic
      },
      error: (error: any) => {
        console.error('Error fetching post:', error);
      }
    });
  }

  addReply() {
    if (this.replyContent.trim()) {
      this.forumService.addReply(this.post._id, { content: this.replyContent }).subscribe({
        next: (updatedPost: any) => {
          this.post = updatedPost;
          this.replyContent = '';
        },
        error: (error: any) => {
          console.error('Error adding reply:', error);
        }
      });
    }
  }

  submitReply(): void {
    if (this.newReply.trim()) {
      this.forumService.addReply(this.post._id, { content: this.newReply }).subscribe({
        next: (updatedPost: any) => {
          this.post = updatedPost;
          this.newReply = '';
        },
        error: (error: any) => {
          console.error('Error submitting reply:', error);
        }
      });
    }
  }
}