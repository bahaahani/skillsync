import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  settingsForm: FormGroup;
  @Output() darkModeChanged = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.settingsForm = this.fb.group({
      emailNotifications: [false],
      darkMode: [false],
      language: ['en']
    });
  }

  ngOnInit() {
    this.userService.getUserSettings().subscribe(
      (settings) => {
        this.settingsForm.patchValue(settings);
      },
      (error) => console.error('Error fetching user settings', error)
    );

    this.settingsForm.get('darkMode')?.valueChanges.subscribe(value => {
      this.darkModeChanged.emit(value);
    });
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      this.userService.updateUserSettings(this.settingsForm.value).subscribe(
        (response) => {
          console.log('Settings updated successfully', response);
        },
        (error) => console.error('Error updating settings', error)
      );
    }
  }
}