import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

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
  message: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      bio: ['']
    });
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userForm.patchValue(this.user);
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.authService.updateUserProfile(this.userForm.value).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.message = 'Profile updated successfully';
        },
        error: (error) => {
          this.message = 'Error updating profile';
          console.error('Error updating user profile:', error);
        }
      });
    }
  }
}