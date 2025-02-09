import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if user is already authenticated and redirect accordingly
    this.authService.checkAuthAndRedirect();
  }

  navigateToAuth(type: 'login' | 'register') {
    this.router.navigate(['/auth'], { 
      queryParams: { type: type }
    });
  }
}