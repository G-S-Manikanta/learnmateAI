import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';

// ...existing code...
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          this.clearStoredAuth();
        }
      }
    }
  }

  login(credentials: LoginRequest): Observable<boolean> {
    // For demo purposes, use mock authentication
    if (credentials.email === 'demo@learnmate.com' && credentials.password === 'demo123') {
      const mockUser: User = {
        id: '1',
        email: 'demo@learnmate.com',
        firstName: 'Demo',
        lastName: 'User',
       role: UserRole.STUDENT,
        avatar: '',
        enrolledCourses: [],
        progress: {},
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.setAuthData('mock-token-123', mockUser);
      return of(true);
    }

    // For real API implementation:
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          this.setAuthData(response.token, response.user);
          return true;
        }),
        catchError(error => {
          console.error('Login error:', error);
          return of(false);
        })
      );
  }

  private setAuthData(token: string, user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
    }
    
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    this.clearStoredAuth();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private clearStoredAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  register(userData: any): Observable<boolean> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        map(response => {
          this.setAuthData(response.token, response.user);
          return true;
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return of(false);
        })
      );
  }

  resetPassword(email: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { email })
      .pipe(
        map(() => true),
        catchError(error => {
          console.error('Password reset error:', error);
          return of(false);
        })
      );
  }

  updateProfile(userData: Partial<User>): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);

    return this.http.put<User>(`${this.apiUrl}/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(user => {
        this.setAuthData(token, user);
        return true;
      }),
      catchError(error => {
        console.error('Profile update error:', error);
        return of(false);
      })
    );
  }
}