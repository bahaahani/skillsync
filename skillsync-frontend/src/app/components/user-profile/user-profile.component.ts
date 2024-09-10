import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    user: any = {};
    isLoading: boolean = false;
    error: string | null = null;

    constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

    ngOnInit() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        this.isLoading = true;
        this.error = null;
        this.apiService.getUserProfile().subscribe(
            (data) => {
                this.user = data;
                this.isLoading = false;
            },
            (error) => {
                console.error('Error fetching user profile:', error);
                this.error = 'Failed to load user profile. Please try again later.';
                this.isLoading = false;
            }
        );
    }

    updateProfile() {
        this.isLoading = true;
        this.error = null;
        this.apiService.updateUserProfile(this.user).subscribe(
            (response) => {
                this.isLoading = false;
                this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
            },
            (error) => {
                console.error('Error updating user profile:', error);
                this.error = 'Failed to update profile. Please try again later.';
                this.isLoading = false;
                this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
            }
        );
    }
}