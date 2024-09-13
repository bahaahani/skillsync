import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  userForm: FormGroup;
  user: any;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      bio: ['', Validators.maxLength(500)],
      profilePicture: [''],
      preferences: this.fb.group({
        emailNotifications: [true],
        darkMode: [false]
      })
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue(user);
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading user profile', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true;
      this.authService.updateUserProfile(this.userForm.value).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open('Error updating profile', 'Close', { duration: 3000 });
          console.error('Error updating user profile:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userForm.patchValue({
          profilePicture: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }
}