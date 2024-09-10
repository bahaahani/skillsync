import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.socketService.connect();
      } else {
        this.socketService.disconnect();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
