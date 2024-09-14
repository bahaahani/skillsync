import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-social-share',
  template: `
    <div class="social-share">
      <button (click)="shareOnFacebook()">{{ 'SOCIAL.SHARE_FACEBOOK' | translate }}</button>
      <button (click)="shareOnTwitter()">{{ 'SOCIAL.SHARE_TWITTER' | translate }}</button>
      <button (click)="shareOnLinkedIn()">{{ 'SOCIAL.SHARE_LINKEDIN' | translate }}</button>
    </div>
  `
})
export class SocialShareComponent {
  @Input() courseId: string;
  @Input() courseTitle: string;

  shareOnFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  }

  shareOnTwitter() {
    const text = encodeURIComponent(`Check out this course: ${this.courseTitle}`);
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  }

  shareOnLinkedIn() {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(this.courseTitle)}`;
    window.open(url, '_blank');
  }
}