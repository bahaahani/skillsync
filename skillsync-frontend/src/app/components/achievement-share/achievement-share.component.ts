import { Component, Input } from '@angular/core';
import { SocialSharingService } from '../../services/social-sharing.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-achievement-share',
  template: `
    <div class="achievement-share">
      <h3>{{ 'ACHIEVEMENTS.SHARE' | translate }}</h3>
      <button (click)="shareOnFacebook()">{{ 'SOCIAL.SHARE_FACEBOOK' | translate }}</button>
      <button (click)="shareOnTwitter()">{{ 'SOCIAL.SHARE_TWITTER' | translate }}</button>
      <button (click)="shareOnLinkedIn()">{{ 'SOCIAL.SHARE_LINKEDIN' | translate }}</button>
    </div>
  `
})
export class AchievementShareComponent {
  @Input() achievementId: string;

  constructor(
    private socialSharingService: SocialSharingService,
    private errorHandler: ErrorHandlingService
  ) {}

  shareOnFacebook() {
    this.share('facebook');
  }

  shareOnTwitter() {
    this.share('twitter');
  }

  shareOnLinkedIn() {
    this.share('linkedin');
  }

  private share(platform: string) {
    this.socialSharingService.shareAchievement(this.achievementId, platform).subscribe(
      () => this.errorHandler.showSuccessMessage('ACHIEVEMENTS.SHARE_SUCCESS'),
      error => this.errorHandler.handleError(error, 'ACHIEVEMENTS.SHARE_ERROR')
    );
  }
}