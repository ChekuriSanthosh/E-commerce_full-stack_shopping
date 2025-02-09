import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authType: 'login' | 'register' = 'login';
  authForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.authType = params['type'] || 'login';
      this.createForm();
    });
  }

  private createForm() {
    if (this.authType === 'login') {
      this.authForm = this.fb.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        role: ['USER', Validators.required]
      });
    } else {
      this.authForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        address: ['', Validators.required],
        phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        role: ['USER']
      });
    }
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.loading = true;

      if (this.authType === 'login') {
        this.authService.login(this.authForm.value).subscribe({
          next: () => {
            this.showMessage('Login successful!');
          },
          error: (error) => {
            console.error('Login Error:', error); // Debug log
            const errorMsg = error.error?.message || error.message || 'Unknown error occurred';
            this.showMessage('Login failed: ' + errorMsg);
            this.loading = false;
          }
        });
      } else {
        const { password, email, ...rest } = this.authForm.value;
        const userData = {
          ...rest,
          email,
          username: email,
          role: 'USER'
        };
        
        this.authService.register(userData, password).subscribe({
          next: () => {
            this.showMessage('Registration successful!');
          },
          error: (error) => {
            console.error('Registration Error:', error); // Debug log
            let errorMessage = 'Registration failed: ';
            if (error.message === 'Email already registered') {
              errorMessage += 'This email is already registered';
            } else {
              errorMessage += error.error?.message || error.message || 'Unknown error occurred';
            }
            this.showMessage(errorMessage);
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      }
    }
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  setAuthType(type: 'login' | 'register') {
    this.authType = type;
    this.createForm();
  }
}