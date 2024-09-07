import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MentorshipService } from '../../services/mentorship.service';

@Component({
    selector: 'app-mentorship',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './mentorship.component.html',
    styleUrls: ['./mentorship.component.css']
})
export class MentorshipComponent implements OnInit {
    availableMentors: any[] = [];
    mentorshipRequests: any[] = [];
    userIsMentor: boolean = false;

    constructor(private mentorshipService: MentorshipService) { }

    ngOnInit() {
        this.loadAvailableMentors();
        this.loadMentorshipRequests();
        this.checkMentorStatus();
    }

    loadAvailableMentors() {
        this.mentorshipService.getAvailableMentors().subscribe(
            (mentors) => {
                this.availableMentors = mentors;
            },
            (error) => console.error('Error loading available mentors', error)
        );
    }

    loadMentorshipRequests() {
        this.mentorshipService.getMentorshipRequests().subscribe(
            (requests) => {
                this.mentorshipRequests = requests;
            },
            (error) => console.error('Error loading mentorship requests', error)
        );
    }

    checkMentorStatus() {
        this.mentorshipService.getUserMentorStatus().subscribe(
            (status) => {
                this.userIsMentor = status.isMentor;
            },
            (error) => console.error('Error checking mentor status', error)
        );
    }

    requestMentorship(mentorId: string) {
        this.mentorshipService.requestMentorship(mentorId).subscribe(
            (response) => {
                console.log('Mentorship request sent successfully');
                // Update the UI or show a notification
            },
            (error) => console.error('Error requesting mentorship', error)
        );
    }

    acceptMentorshipRequest(requestId: string) {
        this.mentorshipService.acceptMentorshipRequest(requestId).subscribe(
            (response) => {
                console.log('Mentorship request accepted');
                this.loadMentorshipRequests();
            },
            (error) => console.error('Error accepting mentorship request', error)
        );
    }

    becomeMentor() {
        this.mentorshipService.becomeMentor().subscribe(
            (response) => {
                console.log('You are now a mentor');
                this.userIsMentor = true;
            },
            (error) => console.error('Error becoming a mentor', error)
        );
    }
}