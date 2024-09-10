import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

interface UserProfile extends User {
    // Add any additional properties specific to UserProfile
}

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    user: User | null = null;
    isEditing: boolean = false;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        this.userService.getUserProfile().subscribe({
            next: (user: User) => {
                this.user = user;
            },
            error: (error: any) => {
                console.error('Error loading user profile:', error);
            }
        });
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }

    saveProfile() {
        if (this.user) {
            this.userService.updateUserProfile(this.user as UserProfile).subscribe({
                next: (updatedUser: User) => {
                    this.user = updatedUser;
                    this.isEditing = false;
                },
                error: (error: any) => {
                    console.error('Error updating user profile:', error);
                }
            });
        }
    }
}