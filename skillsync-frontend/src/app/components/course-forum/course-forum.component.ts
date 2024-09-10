import { Component, OnInit, Input } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { AuthService } from '../../services/auth.service';

interface ForumPost {
  _id: string;
  courseId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

@Component({
  selector: 'app-course-forum',
  templateUrl: './course-forum.component.html',
  styleUrls: ['./course-forum.component.css']
})
export class CourseForumComponent implements OnInit {
  @Input() courseId!: string;
  posts: ForumPost[] = [];
  newPostContent: string = '';

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.courseService.getForumPosts(this.courseId).subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error('Error loading forum posts:', error);
      }
    });
  }

  createPost() {
    if (this.newPostContent.trim()) {
      this.courseService.createForumPost(this.courseId, this.newPostContent).subscribe({
        next: (newPost) => {
          this.posts.unshift(newPost);
          this.newPostContent = '';
        },
        error: (error) => {
          console.error('Error creating forum post:', error);
        }
      });
    }
  }
}