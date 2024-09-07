import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    user: any;
    profileForm: FormGroup;
    isEditing: boolean = false;

    constructor(
        private userService: UserService,
        private fb: FormBuilder
    ) {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            jobTitle: ['', Validators.required],
            department: ['', Validators.required],
            skills: this.fb.array([])
        });
    }

    ngOnInit() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        this.userService.getCurrentUser().subscribe(
            (user) => {
                this.user = user;
                this.profileForm.patchValue(user);
                this.setSkills(user.skills);
            },
            (error) => console.error('Error loading user profile', error)
        );
    }

    get skills() {
        return this.profileForm.get('skills') as FormArray;
    }

    setSkills(skills: string[]) {
        const skillFGs = skills.map(skill => this.fb.control(skill));
        const skillFormArray = this.fb.array(skillFGs);
        this.profileForm.setControl('skills', skillFormArray);
    }

    addSkill() {
        this.skills.push(this.fb.control(''));
    }

    removeSkill(index: number) {
        this.skills.removeAt(index);
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            this.profileForm.patchValue(this.user);
            this.setSkills(this.user.skills);
        }
    }

    saveProfile() {
        if (this.profileForm.valid) {
            this.userService.updateUserProfile(this.profileForm.value).subscribe(
                (updatedUser) => {
                    this.user = updatedUser;
                    this.isEditing = false;
                },
                (error) => console.error('Error updating user profile', error)
            );
        }
    }
}