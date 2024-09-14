import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MentorshipService } from '../../services/mentorship.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
    selector: 'app-mentorship',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './mentorship.component.html',
    styleUrls: ['./mentorship.component.css']
})
export class MentorshipComponent implements OnInit {
    mentors: any[] = [];
    mentorshipRequests: any[] = [];
    isMentor: boolean = false; // This should be set based on user role

    constructor(
        private mentorshipService: MentorshipService,
        private errorHandler: ErrorHandlingService
    ) { }

    ngOnInit() {
        this.loadMentors();
        if (this.isMentor) {
            this.loadMentorshipRequests();
        }
    }

    loadMentors() {
        this.mentorshipService.getMentors().subscribe(
            data => this.mentors = data,
            error => this.errorHandler.handleError(error, 'MENTORSHIP.LOAD_MENTORS_ERROR')
        );
    }

    loadMentorshipRequests() {
        this.mentorshipService.getMentorshipRequests().subscribe(
            data => this.mentorshipRequests = data,
            error => this.errorHandler.handleError(error, 'MENTORSHIP.LOAD_REQUESTS_ERROR')
        );
    }

    requestMentor(mentorId: string) {
        this.mentorshipService.requestMentor(mentorId).subscribe(
            () => this.errorHandler.showSuccessMessage('MENTORSHIP.REQUEST_SENT'),
            error => this.errorHandler.handleError(error, 'MENTORSHIP.REQUEST_ERROR')
        );
    }

    acceptRequest(requestId: string) {
        this.mentorshipService.acceptMentorshipRequest(requestId).subscribe(
            () => {
                this.errorHandler.showSuccessMessage('MENTORSHIP.REQUEST_ACCEPTED');
                this.loadMentorshipRequests();
            },
            error => this.errorHandler.handleError(error, 'MENTORSHIP.ACCEPT_ERROR')
        );
    }
}