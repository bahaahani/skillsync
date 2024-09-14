import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuidedTourService {
  private tourSteps: any[] = [
    { element: '#dashboard', title: 'Dashboard', content: 'This is your main dashboard.' },
    { element: '#courses', title: 'Courses', content: 'Browse and enroll in courses here.' },
    { element: '#profile', title: 'Profile', content: 'View and edit your profile information.' },
    // Add more steps as needed
  ];

  private currentStepSubject = new BehaviorSubject<number>(0);
  currentStep$ = this.currentStepSubject.asObservable();

  startTour() {
    this.currentStepSubject.next(0);
  }

  nextStep() {
    const currentStep = this.currentStepSubject.value;
    if (currentStep < this.tourSteps.length - 1) {
      this.currentStepSubject.next(currentStep + 1);
    } else {
      this.endTour();
    }
  }

  previousStep() {
    const currentStep = this.currentStepSubject.value;
    if (currentStep > 0) {
      this.currentStepSubject.next(currentStep - 1);
    }
  }

  endTour() {
    this.currentStepSubject.next(-1);
  }

  getCurrentStep() {
    return this.tourSteps[this.currentStepSubject.value];
  }
}