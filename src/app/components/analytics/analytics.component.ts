import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { 
  AnalyticsData, 
  StudyStats, 
  PerformanceMetrics, 
  LearningProgress,
  TimeAnalytics,
  SubjectAnalytics,
  WeeklyStudyTime,
  Badge,
  Achievement
} from '../../models/analytics.model';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  analyticsData: AnalyticsData | null = null;
  selectedTimeRange: 'week' | 'month' | 'quarter' = 'week';
  timeRanges: ('week' | 'month' | 'quarter')[] = ['week', 'month', 'quarter'];
  isLoading = true;
  error = '';

  // Chart data for visualization - optimized for smaller initial load
  weeklyPerformanceData: any[] = [];
  learningCurveData: any[] = [];
  topicStrengthData: any[] = [];
  
  // Quick stats
  currentWeekPerformance = 0;
  previousWeekPerformance = 0;
  performanceChange = 0;
  
  // Top revision topics - limited to prevent large data sets
  topRevisionTopics: any[] = [];
  
  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAnalyticsData(): void {
    this.isLoading = true;
    this.error = '';
    
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // Using setTimeout to prevent blocking the UI thread
      setTimeout(() => {
        this.generateMockAnalyticsData();
        this.cdr.markForCheck();
      }, 0);
    } else {
      this.error = 'User not authenticated';
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  changeTimeRange(range: 'week' | 'month' | 'quarter'): void {
    this.selectedTimeRange = range;
    // Debounce data generation to prevent rapid successive calls
    setTimeout(() => {
      this.generateMockAnalyticsData();
      this.cdr.markForCheck();
    }, 100);
  }

  private generateMockAnalyticsData(): void {
    // Minimal mock analytics data for faster loading
    this.analyticsData = {
      userId: 'user123',
      studyStats: {
        totalStudyTime: 360, // 6 hours
        averageSessionDuration: 45,
        studyStreak: 7,
        longestStreak: 14,
        totalSessions: 8,
        completedTutorials: 5,
        inProgressTutorials: 2
      },
      performanceMetrics: {
        overallScore: 85,
        averageQuizScore: 82,
        totalQuizzesTaken: 8,
        totalQuizzesPassed: 6,
        improvementRate: 15,
        strongSubjects: ['Mathematics'],
        weakSubjects: ['Chemistry']
      },
      learningProgress: {
        currentLevel: 'intermediate' as any,
        experiencePoints: 1200,
        nextLevelProgress: 65,
        badges: this.generateMockBadges(),
        achievements: [],
        milestones: []
      },
      timeAnalytics: {
        dailyStudyTime: [],
        weeklyStudyTime: this.generateWeeklyStudyTime(),
        monthlyStudyTime: [],
        peakStudyHours: [14, 15, 19], // 2-3 PM, 7 PM
        studyPattern: 'afternoon_learner' as any
      },
      subjectAnalytics: this.generateSubjectAnalytics()
    };

    this.processAnalyticsData();
    this.isLoading = false;
  }

  private generateMockBadges(): Badge[] {
    return [
      {
        id: '1',
        name: 'Study Streak',
        description: 'Studied for 7 consecutive days',
        icon: '🔥',
        earnedAt: new Date(2024, 6, 20),
        category: 'streak' as any
      },
      {
        id: '2',
        name: 'Quiz Master',
        description: 'Scored 90% or higher',
        icon: '🏆',
        earnedAt: new Date(2024, 6, 15),
        category: 'quiz_performance' as any
      }
    ];
  }

  private generateMockAchievements(): Achievement[] {
    return [
      {
        id: '1',
        title: 'First Steps',
        description: 'Completed your first tutorial',
        icon: '👶',
        unlockedAt: new Date(2024, 5, 1),
        points: 50
      },
      {
        id: '2',
        title: 'Dedicated Learner',
        description: 'Studied for 10 hours total',
        icon: '📚',
        unlockedAt: new Date(2024, 6, 5),
        points: 200
      }
    ];
  }

  private generateWeeklyStudyTime(): WeeklyStudyTime[] {
    // Generate only 4 weeks of data instead of 8 for faster loading
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      weeks.push({
        weekStart,
        totalMinutes: Math.floor(Math.random() * 400) + 200,
        averageDailyMinutes: Math.floor(Math.random() * 60) + 30,
        activeDays: Math.floor(Math.random() * 3) + 5
      });
    }
    return weeks;
  }

  private generateSubjectAnalytics(): SubjectAnalytics[] {
    // Reduce to only 2 subjects for faster rendering
    return [
      {
        subject: 'Mathematics',
        totalStudyTime: 180,
        completedTutorials: 3,
        averageScore: 88,
        progressPercentage: 75,
        lastStudied: new Date(2024, 6, 23),
        difficulty: 'intermediate' as any,
        recommendedNextSteps: ['Calculus Basics']
      },
      {
        subject: 'Chemistry',
        totalStudyTime: 120,
        completedTutorials: 2,
        averageScore: 72,
        progressPercentage: 50,
        lastStudied: new Date(2024, 6, 22),
        difficulty: 'beginner' as any,
        recommendedNextSteps: ['Chemical Bonding']
      }
    ];
  }

  private processAnalyticsData(): void {
    if (!this.analyticsData) return;

    // Calculate weekly performance change
    const weeklyData = this.analyticsData.timeAnalytics.weeklyStudyTime;
    if (weeklyData.length >= 2) {
      this.currentWeekPerformance = weeklyData[weeklyData.length - 1].totalMinutes;
      this.previousWeekPerformance = weeklyData[weeklyData.length - 2].totalMinutes;
      this.performanceChange = ((this.currentWeekPerformance - this.previousWeekPerformance) / this.previousWeekPerformance) * 100;
    }

    // Generate chart data
    this.weeklyPerformanceData = weeklyData.map((week, index) => ({
      week: `Week ${index + 1}`,
      studyTime: week.totalMinutes,
      activeDays: week.activeDays
    }));

    // Learning curve data (simulated improvement over time)
    this.learningCurveData = weeklyData.map((week, index) => ({
      week: `Week ${index + 1}`,
      score: Math.min(60 + (index * 5) + Math.random() * 10, 95)
    }));

    // Topic strength/weakness data
    this.topicStrengthData = this.analyticsData.subjectAnalytics.map(subject => ({
      subject: subject.subject,
      strength: subject.averageScore,
      studyTime: subject.totalStudyTime
    }));

    // Top revision topics (weakest subjects)
    this.topRevisionTopics = this.analyticsData.subjectAnalytics
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 3);
  }

  getPerformanceChangeIcon(): string {
    return this.performanceChange > 0 ? '📈' : this.performanceChange < 0 ? '📉' : '➡️';
  }

  getPerformanceChangeClass(): string {
    return this.performanceChange > 0 ? 'positive' : this.performanceChange < 0 ? 'negative' : 'neutral';
  }

  formatStudyTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  getStudyPatternText(): string {
    if (!this.analyticsData) return '';
    
    const patterns: {[key: string]: string} = {
      'morning_person': 'Morning Learner 🌅',
      'afternoon_learner': 'Afternoon Studier ☀️',
      'evening_studier': 'Evening Learner 🌆',
      'night_owl': 'Night Owl 🦉',
      'consistent': 'Consistent Learner ⭐',
      'irregular': 'Flexible Schedule 🔄'
    };
    
    return patterns[this.analyticsData.timeAnalytics.studyPattern] || 'Learning Pattern';
  }
}
