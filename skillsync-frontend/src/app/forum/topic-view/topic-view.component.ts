import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topic-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topic-view.component.html',
  styleUrls: ['./topic-view.component.css']
})
export class TopicViewComponent implements OnInit {
  topic: any;
  newReply: string = '';
  user: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    const topicId = this.route.snapshot.paramMap.get('id');
    this.loadTopic(topicId);
  }

  loadTopic(topicId: string | null) {
    if (topicId) {
      this.http.get<any>(`http://localhost:3000/api/forum/topics/${topicId}`).subscribe({
        next: (data) => {
          this.topic = data;
        },
        error: (error) => {
          console.error('Error fetching topic:', error);
        }
      });
    }
  }

  submitReply() {
    if (this.newReply.trim()) {
      this.http.post(`http://localhost:3000/api/forum/topics/${this.topic._id}/replies`, { content: this.newReply }).subscribe({
        next: () => {
          this.loadTopic(this.topic._id);
          this.newReply = '';
        },
        error: (error) => {
          console.error('Error submitting reply:', error);
        }
      });
    }
  }
}