import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ForumService } from '../services/forum.service';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  posts: any[] = [];
  newPost: string = '';
  newTopic: { title: string, content: string } = { title: '', content: '' };
  user: any;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(private forumService: ForumService) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.forumService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      }
    });
  }

  submitPost() {
    if (this.newPost.trim()) {
      this.http.post('http://localhost:3000/api/forum/posts', { content: this.newPost }).subscribe({
        next: () => {
          this.loadPosts();
          this.newPost = '';
        },
        error: (error) => {
          console.error('Error submitting post:', error);
        }
      });
    }
  }

  createTopic() {
    if (this.newTopic.title.trim() && this.newTopic.content.trim()) {
      this.http.post('http://localhost:3000/api/forum/topics', this.newTopic).subscribe({
        next: () => {
          this.loadPosts();
          this.newTopic = { title: '', content: '' };
        },
        error: (error) => {
          console.error('Error creating topic:', error);
        }
      });
    }
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadPosts();
    }
  }
}
