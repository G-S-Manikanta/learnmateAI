import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TutorialService } from '../../services/tutorial.service';
import { AnalyticsService } from '../../services/analytics.service';
import { User } from '../../models/user.model';
import { Tutorial, TutorialProgress } from '../../models/tutorial.model';
import { StudyStats } from '../../models/analytics.model';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  studyStats: StudyStats | null = null;
  recentTutorials: Tutorial[] = [];
  inProgressTutorials: TutorialProgress[] = [];
  recommendedTutorials: Tutorial[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private tutorialService: TutorialService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserData(user.id);
      }
    });
  }

  private loadUserData(userId: string): void {
    // Load study stats
    this.studyStats = {
      totalStudyTime: 1250, // minutes
      averageSessionDuration: 45,
      studyStreak: 7,
      longestStreak: 14,
      totalSessions: 28,
      completedTutorials: 12,
      inProgressTutorials: 3
    };

    // Load recent tutorials (mock data)
    this.recentTutorials = [
      {
        id: '1',
        title: 'Advanced JavaScript Concepts',
        description: 'Deep dive into advanced JS topics',
        subject: 'Programming',
        difficulty: 'intermediate' as any,
        estimatedDuration: 120,
        content: [],
        tags: ['JavaScript', 'Advanced'],
        createdBy: 'instructor1',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        rating: 4.5,
        totalRatings: 89
      }
    ];

    // Load recommended tutorials
    this.recommendedTutorials = [
      {
        id: '2',
        title: 'React Fundamentals',
        description: 'Learn React from scratch',
        subject: 'Programming',
        difficulty: 'beginner' as any,
        estimatedDuration: 180,
        content: [],
        tags: ['React', 'Frontend'],
        createdBy: 'instructor2',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        rating: 4.7,
        totalRatings: 156
      }
    ];

    this.isLoading = false;
  }

  logout(): void {
    this.authService.logout();
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
}
