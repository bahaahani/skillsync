import { Component, Input } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-certificate-share',
  template: `
    <div class="certificate-share">
      <h3>{{ 'CERTIFICATE.SHARE' | translate }}</h3>
      <button (click)="shareOnLinkedIn()">{{ 'CERTIFICATE.SHARE_LINKEDIN' | translate }}</button>
      <button (click)="shareOnTwitter()">{{ 'CERTIFICATE.SHARE_TWITTER' | translate }}</button>
    </div>
  `
})
export class CertificateShareComponent {
  @Input() courseId: string;
  @Input() certificateId: string;

  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {}

  shareOnLinkedIn() {
    this.courseService.getShareableLink(this.courseId, this.certificateId, 'linkedin').subscribe(
      link => {
        window.open(link, '_blank');
      },
      error => this.errorHandler.handleError(error, 'CERTIFICATE.SHARE_ERROR')
    );
  }

  shareOnTwitter() {
    this.courseService.getShareableLink(this.courseId, this.certificateId, 'twitter').subscribe(
      link => {
        window.open(link, '_blank');
      },
      error => this.errorHandler.handleError(error, 'CERTIFICATE.SHARE_ERROR')
    );
  }
}