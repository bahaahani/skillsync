import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <h1>Access Denied</h1>
        <p>You do not have permission to access this resource.</p>
        <div class="actions">
          <button (click)="goHome()" class="home-button">Go to Home</button>
          <button (click)="goBack()" class="back-button">Go Back</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }
    
    .unauthorized-content {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 500px;
    }
    
    h1 {
      color: #dc3545;
      margin-bottom: 1rem;
    }
    
    p {
      margin-bottom: 2rem;
      color: #6c757d;
    }
    
    .actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .home-button {
      background-color: #007bff;
      color: white;
    }
    
    .back-button {
      background-color: #6c757d;
      color: white;
    }
  `]
})
export class UnauthorizedComponent {

  constructor(private router: Router) { }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }
} 