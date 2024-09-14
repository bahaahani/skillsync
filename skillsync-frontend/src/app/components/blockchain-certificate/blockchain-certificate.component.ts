import { Component, Input, OnInit } from '@angular/core';
import { BlockchainCertificationService } from '../../services/blockchain-certification.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-blockchain-certificate',
  template: `
    <div class="blockchain-certificate">
      <h2>{{ 'CERTIFICATE.BLOCKCHAIN_TITLE' | translate }}</h2>
      <div *ngIf="certificateDetails">
        <p>{{ 'CERTIFICATE.COURSE' | translate }}: {{ certificateDetails.courseName }}</p>
        <p>{{ 'CERTIFICATE.ISSUED_TO' | translate }}: {{ certificateDetails.userName }}</p>
        <p>{{ 'CERTIFICATE.ISSUED_ON' | translate }}: {{ certificateDetails.issuedDate | date }}</p>
        <p>{{ 'CERTIFICATE.BLOCKCHAIN_ID' | translate }}: {{ certificateDetails.blockchainId }}</p>
      </div>
      <button (click)="verifyCertificate()">{{ 'CERTIFICATE.VERIFY' | translate }}</button>
      <p *ngIf="verificationResult !== null">
        {{ verificationResult ? ('CERTIFICATE.VALID' | translate) : ('CERTIFICATE.INVALID' | translate) }}
      </p>
    </div>
  `
})
export class BlockchainCertificateComponent implements OnInit {
  @Input() certificateId: string;
  certificateDetails: any;
  verificationResult: boolean | null = null;

  constructor(
    private blockchainCertificationService: BlockchainCertificationService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.loadCertificateDetails();
  }

  loadCertificateDetails() {
    this.blockchainCertificationService.getCertificateDetails(this.certificateId).subscribe(
      details => this.certificateDetails = details,
      error => this.errorHandler.handleError(error, 'CERTIFICATE.LOAD_ERROR')
    );
  }

  verifyCertificate() {
    this.blockchainCertificationService.verifyCertificate(this.certificateId).subscribe(
      result => this.verificationResult = result.isValid,
      error => this.errorHandler.handleError(error, 'CERTIFICATE.VERIFICATION_ERROR')
    );
  }
}