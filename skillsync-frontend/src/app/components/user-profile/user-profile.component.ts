import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
    profileForm: FormGroup;
    user: any;
    isLoading = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private apiService: ApiService,
        private errorHandler: ErrorHandlingService,
        private cdr: ChangeDetectorRef
    ) {
        this.profileForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        this.isLoading = true;
        this.authService.getCurrentUser().subscribe({
            next: (user) => {
                this.user = user;
                this.profileForm.patchValue({
                    name: user.name,
                    email: user.email
                });
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: (error) => {
                this.errorHandler.handleError(error, 'PROFILE.LOAD_ERROR');
                this.isLoading = false;
                this.cdr.markForCheck();
            }
        });
    }

    onSubmit() {
        if (this.profileForm.valid) {
            this.isLoading = true;
            this.apiService.updateUserProfile(this.profileForm.value).subscribe({
                next: (updatedUser) => {
                    this.user = updatedUser;
                    this.errorHandler.showSuccessMessage('PROFILE.UPDATE_SUCCESS');
                    this.isLoading = false;
                    this.cdr.markForCheck();
                },
                error: (error) => {
                    this.errorHandler.handleError(error, 'PROFILE.UPDATE_ERROR');
                    this.isLoading = false;
                    this.cdr.markForCheck();
                }
            });
        }
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            this.isLoading = true;
            this.apiService.uploadProfilePicture(file).subscribe({
                next: (response) => {
                    this.user.profilePictureUrl = response.profilePictureUrl;
                    this.errorHandler.showSuccessMessage('PROFILE.PICTURE_UPLOAD_SUCCESS');
                    this.isLoading = false;
                    this.cdr.markForCheck();
                },
                error: (error) => {
                    this.errorHandler.handleError(error, 'PROFILE.PICTURE_UPLOAD_ERROR');
                    this.isLoading = false;
                    this.cdr.markForCheck();
                }
            });
        }
    }

    deleteProfilePicture() {
        this.isLoading = true;
        this.apiService.deleteProfilePicture().subscribe({
            next: () => {
                this.user.profilePictureUrl = null;
                this.errorHandler.showSuccessMessage('PROFILE.PICTURE_DELETE_SUCCESS');
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: (error) => {
                this.errorHandler.handleError(error, 'PROFILE.PICTURE_DELETE_ERROR');
                this.isLoading = false;
                this.cdr.markForCheck();
            }
        });
    }
}