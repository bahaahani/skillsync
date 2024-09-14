import { Component, Input, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-course-certificate',
  template: `
    <div class="certificate" *ngIf="certificateData">
      <h2>{{ 'CERTIFICATE.TITLE' | translate }}</h2>
      <p>{{ 'CERTIFICATE.THIS_CERTIFIES' | translate }}</p>
      <h3>{{ certificateData.userName }}</h3>
      <p>{{ 'CERTIFICATE.HAS_COMPLETED' | translate }}</p>
      <h3>{{ certificateData.courseName }}</h3>
      <p>{{ 'CERTIFICATE.DATE' | translate }}: {{ certificateData.completionDate | date:'longDate' }}</p>
      <img [src]="certificateData.signature" alt="Instructor Signature">
      <p>{{ certificateData.instructorName }}</p>
    </div>
    <button mat-raised-button color="primary" (click)="downloadCertificate()">
      {{ 'CERTIFICATE.DOWNLOAD' | translate }}
    </button>
    <button mat-raised-button color="accent" (click)="shareOnLinkedIn()">
      {{ 'CERTIFICATE.SHARE_LINKEDIN' | translate }}
    </button>
  `
})
export class CourseCertificateComponent implements OnInit {
  @Input() courseId: string;
  certificateData: any;

  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadCertificateData();
  }

  loadCertificateData() {
    this.courseService.getCertificateData(this.courseId).subscribe(
      data => this.certificateData = data,
      error => this.errorHandler.handleError(error, 'CERTIFICATE.LOAD_ERROR')
    );
  }

  downloadCertificate() {
    this.courseService.downloadCertificate(this.courseId).subscribe(
      blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate_${this.courseId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error => this.errorHandler.handleError(error, 'CERTIFICATE.DOWNLOAD_ERROR')
    );
  }

  shareOnLinkedIn() {
    const shareUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(this.certificateData.courseName)}&organizationId=1&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank');
  }
}