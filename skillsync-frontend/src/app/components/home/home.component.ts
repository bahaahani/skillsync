import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, LeaderboardComponent, ReactiveFormsModule]
})
export class HomeComponent implements OnInit {
  user: any;
  socialFeed: any[] = [];
  forumTopics: any[] = [];
  userGoals: any[] = [];
  postForm: FormGroup;
  forumForm: FormGroup;
  goalForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(280)]]
    });
    this.forumForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(1000)]]
    });
    this.goalForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadSocialFeed();
    this.loadForumTopics();
    this.loadUserGoals();
  }

  loadUserData() {
    this.userService.getCurrentUser().subscribe(
      (user) => {
        this.user = user;
      },
      (error) => console.error('Error loading user data', error)
    );
  }

  loadSocialFeed() {
    this.userService.getSocialFeed().subscribe(
      (feed) => {
        this.socialFeed = feed;
      },
      (error) => console.error('Error loading social feed', error)
    );
  }

  loadForumTopics() {
    this.userService.getForumTopics().subscribe(
      (topics) => {
        this.forumTopics = topics;
      },
      (error) => console.error('Error loading forum topics', error)
    );
  }

  loadUserGoals() {
    this.userService.getUserGoals().subscribe(
      (goals) => {
        this.userGoals = goals;
      },
      (error) => console.error('Error loading user goals', error)
    );
  }

  createPost() {
    if (this.postForm.valid) {
      const content = this.postForm.get('content')?.value;
      this.userService.createPost(content).subscribe(
        (newPost) => {
          this.socialFeed.unshift(newPost);
          this.postForm.reset();
        },
        (error) => console.error('Error creating post', error)
      );
    }
  }

  createForumTopic() {
    if (this.forumForm.valid) {
      const { title, content } = this.forumForm.value;
      this.userService.createForumTopic(title, content).subscribe(
        (newTopic) => {
          this.forumTopics.unshift(newTopic);
          this.forumForm.reset();
        },
        (error) => console.error('Error creating forum topic', error)
      );
    }
  }

  addGoal() {
    if (this.goalForm.valid) {
      const { title, dueDate } = this.goalForm.value;
      this.userService.createUserGoal(title, dueDate).subscribe(
        (newGoal) => {
          this.userGoals.push(newGoal);
          this.goalForm.reset();
        },
        (error) => console.error('Error adding goal', error)
      );
    }
  }

  logout() {
    this.authService.logout().subscribe(
      () => {
        this.user = null;
        this.router.navigate(['/login']);
      },
      (error) => console.error('Error logging out', error)
    );
  }

  // Add a method to check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.user;
  }
}