import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, UserPreferences } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // Replace with your API URL
  private userProfileSubject = new BehaviorSubject<User | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`)
      .pipe(
        tap(user => this.userProfileSubject.next(user))
      );
  }

  updateUserProfile(userId: string, updateData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, updateData)
      .pipe(
        tap(user => this.userProfileSubject.next(user))
      );
  }

  updateUserPreferences(userId: string, preferences: UserPreferences): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/preferences`, preferences)
      .pipe(
        tap(user => this.userProfileSubject.next(user))
      );
  }

  uploadAvatar(userId: string, file: File): Observable<{avatarUrl: string}> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.http.post<{avatarUrl: string}>(`${this.apiUrl}/${userId}/avatar`, formData);
  }

  deleteUser(userId: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/${userId}`);
  }

  getAllUsers(page: number = 1, limit: number = 10): Observable<{users: User[], total: number, page: number, totalPages: number}> {
    return this.http.get<{users: User[], total: number, page: number, totalPages: number}>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  activateUser(userId: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/activate`, {});
  }

  deactivateUser(userId: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/deactivate`, {});
  }

  getUserStatistics(userId: string): Observable<{
    totalStudyTime: number;
    completedTutorials: number;
    currentStreak: number;
    lastLoginDate: Date;
  }> {
    return this.http.get<{
      totalStudyTime: number;
      completedTutorials: number;
      currentStreak: number;
      lastLoginDate: Date;
    }>(`${this.apiUrl}/${userId}/statistics`);
  }
}
