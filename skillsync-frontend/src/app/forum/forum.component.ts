import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ForumService } from '../services/forum.service';
import { Router } from '@angular/router';

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

  constructor(private forumService: ForumService, private router: Router) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.forumService.getAllPosts(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.posts = response.posts;
        this.totalPages = response.totalPages;
      },
      error: (error: any) => {
        console.error('Error fetching posts:', error);
      }
    });
  }

  submitPost() {
    if (this.newPost.trim()) {
      this.forumService.createPost({ content: this.newPost }).subscribe({
        next: () => {
          this.loadPosts();
          this.newPost = '';
        },
        error: (error: any) => {
          console.error('Error submitting post:', error);
        }
      });
    }
  }

  createTopic() {
    if (this.newTopic.title.trim() && this.newTopic.content.trim()) {
      this.forumService.createTopic(this.newTopic).subscribe({
        next: (createdTopic) => {
          this.loadPosts();
          this.newTopic = { title: '', content: '' };
          this.router.navigate(['/forum', createdTopic._id]);
        },
        error: (error: any) => {
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
