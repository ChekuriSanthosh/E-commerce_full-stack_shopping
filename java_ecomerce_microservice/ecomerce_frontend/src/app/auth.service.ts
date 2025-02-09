import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap, from, map } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Fixed import

interface AuthResponse {
  jwt: string;
  status?: string;
  message?: string;
}

interface UserData {
  name: string;
  email: string;
  role: "USER";
  address: string;
  phoneNumber: string;
}

interface JwtPayload {
  sub: string;
  role?: string;
  exp: number;
}

interface UserModel {
  username: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8888';
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/auth/check-email/${email}`);
  }

  register(userData: UserData, password: string): Observable<any> {
    const registerData = {
      ...userData,
      password,
      username: userData.email
    };

    // First check if email exists
    return this.checkEmailExists(userData.email).pipe(
      switchMap(exists => {
        if (exists) {
          throw new Error('Email already registered');
        }
        return this.http.post(`${this.baseUrl}/auth/register`, registerData);
      }),
      switchMap(() => this.login({
        username: userData.email,
        password: password,
        role: 'USER'
      })),
      switchMap((loginResponse: any) => {
        console.log('Login Response:', loginResponse);
        
        // Check for jwt token instead of token/access_token
        const token = loginResponse?.jwt;
        if (!token) {
          console.error('Login Response Structure:', loginResponse);
          throw new Error('No token received from login');
        }
        
        localStorage.setItem('jwt.auth', token);
        this.authStatusSubject.next(true);
        
        return this.http.post(`${this.baseUrl}/user`, {
          name: userData.name,
          email: userData.email,
          role: 'USER',
          address: userData.address,
          phoneNumber: userData.phoneNumber
        });
      })
    );
  }

  login(credentials: { username: string; password: string; role: string }): Observable<AuthResponse> {
    console.log('Login Request:', credentials);
    
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        console.log('Login Response:', response);
        
        // Check for jwt token instead of token/access_token
        const token = response?.jwt;
        if (!token) {
          console.error('Login Response Structure:', response);
          throw new Error('No token received');
        }
        
        localStorage.setItem('jwt.auth', token);
        this.authStatusSubject.next(true);
        this.redirectBasedOnRole(credentials.role);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt.auth');
    this.authStatusSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt.auth');
  }

  getToken(): string | null {
    const token = localStorage.getItem('jwt.auth');
    if (!token) return null;
    
    // Validate token format (should contain two periods)
    if (token.split('.').length !== 3) {
      this.logout(); // Clear invalid token
      return null;
    }
    
    return token;
  }

  getUserRole(): Observable<string> {
    const token = this.getToken();
    if (!token) return from(Promise.resolve('')); // Return empty string if no token

    // First get username from token
    return this.http.get<string>(`${this.baseUrl}/auth/jwtToken/${token}`).pipe(
      // Then get user details using username
      switchMap(username => 
        this.http.get<UserModel>(`${this.baseUrl}/getUser/${username}`)
      ),
      // Extract role from user details
      map(userModel => userModel.role)
    );
  }

  checkAuthAndRedirect() {
    if (this.isLoggedIn()) {
      this.getUserRole().subscribe({
        next: (role) => {
          this.redirectBasedOnRole(role || 'USER');
        },
        error: (error) => {
          console.error('Error getting user role:', error);
          this.logout(); // Clear invalid session
          this.router.navigate(['/']);
        }
      });
      return true;
    }
    return false;
  }

  private redirectBasedOnRole(role: string) {
    if (role === 'ADMIN') {
      this.router.navigate(['/product']);
    } else if (role === 'USER') {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/']);
    }
  }

  getUsernameFromToken(token: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/auth/jwtToken/${token}`, { 
      responseType: 'text' 
    });
  }
}