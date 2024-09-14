import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollaborationService } from '../../services/collaboration.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group-project',
  template: `
    <div class="group-project">
      <h2>{{ 'GROUP_PROJECT.TITLE' | translate }}</h2>
      <div class="project-content">
        <textarea [(ngModel)]="projectContent" (ngModelChange)="onContentChange()"></textarea>
      </div>
      <div class="collaborators">
        <h3>{{ 'GROUP_PROJECT.COLLABORATORS' | translate }}</h3>
        <ul>
          <li *ngFor="let collaborator of collaborators">{{ collaborator }}</li>
        </ul>
      </div>
    </div>
  `
})
export class GroupProjectComponent implements OnInit, OnDestroy {
  projectId: string;
  userId: string;
  projectContent: string = '';
  collaborators: string[] = [];
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private collaborationService: CollaborationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.userId = this.authService.getCurrentUserId();
    this.collaborationService.joinProject(this.projectId, this.userId);

    this.subscription = this.collaborationService.getUpdates().subscribe(
      update => this.handleUpdate(update)
    );
  }

  ngOnDestroy() {
    this.collaborationService.leaveProject(this.projectId, this.userId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onContentChange() {
    this.collaborationService.sendUpdate(this.projectId, this.userId, { content: this.projectContent });
  }

  private handleUpdate(update: any) {
    if (update.type === 'content') {
      this.projectContent = update.content;
    } else if (update.type === 'collaborators') {
      this.collaborators = update.collaborators;
    }
  }
}