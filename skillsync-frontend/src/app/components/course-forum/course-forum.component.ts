import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-course-forum',
  templateUrl: './course-forum.component.html',
  styleUrls: ['./course-forum.component.css']
})
export class CourseForumComponent implements OnInit {
  @Input() courseId!: string;
  posts: any[] = [];
  newPost: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading = true;
    this.error = null;
    this.apiService.getForumPosts(this.courseId).subscribe(
      data => {
        this.posts = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching forum posts:', error);
        this.error = 'Failed to load forum posts. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  createPost() {
    if (this.newPost.trim()) {
      this.apiService.createForumPost(this.courseId, { content: this.newPost }).subscribe(
        response => {
          console.log('Post created:', response);
          this.newPost = '';
          this.loadPosts();
        },
        error => {
          console.error('Error creating post:', error);
          this.error = 'Failed to create post. Please try again later.';
        }
      );
    }
  }
}