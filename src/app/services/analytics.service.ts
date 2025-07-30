import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { 
  AnalyticsData, 
  StudyStats, 
  PerformanceMetrics, 
  LearningProgress,
  TimeAnalytics,
  SubjectAnalytics,
  DailyStudyTime,
  WeeklyStudyTime,
  MonthlyStudyTime,
  Badge,
  Achievement,
  Milestone
} from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/api/analytics'; // Replace with your API URL
  private analyticsDataSubject = new BehaviorSubject<AnalyticsData | null>(null);
  public analyticsData$ = this.analyticsDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Main analytics data
  getUserAnalytics(userId: string): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.apiUrl}/user/${userId}`)
      .pipe(
        tap(data => this.analyticsDataSubject.next(data))
      );
  }

  // Study statistics
  getStudyStats(userId: string): Observable<StudyStats> {
    return this.http.get<StudyStats>(`${this.apiUrl}/user/${userId}/study-stats`);
  }

  updateStudySession(userId: string, sessionData: {
    duration: number;
    tutorialId: string;
    completedContent: string[];
    startTime: Date;
    endTime: Date;
  }): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/user/${userId}/study-session`, sessionData);
  }

  // Performance metrics
  getPerformanceMetrics(userId: string): Observable<PerformanceMetrics> {
    return this.http.get<PerformanceMetrics>(`${this.apiUrl}/user/${userId}/performance`);
  }

  recordQuizResult(userId: string, quizData: {
    tutorialId: string;
    contentId: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
    answers: Array<{questionId: string, correct: boolean}>;
  }): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/user/${userId}/quiz-result`, quizData);
  }

  // Learning progress and achievements
  getLearningProgress(userId: string): Observable<LearningProgress> {
    return this.http.get<LearningProgress>(`${this.apiUrl}/user/${userId}/learning-progress`);
  }

  getUserBadges(userId: string): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/user/${userId}/badges`);
  }

  getUserAchievements(userId: string): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.apiUrl}/user/${userId}/achievements`);
  }

  getUserMilestones(userId: string): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(`${this.apiUrl}/user/${userId}/milestones`);
  }

  checkAndAwardBadges(userId: string): Observable<Badge[]> {
    return this.http.post<Badge[]>(`${this.apiUrl}/user/${userId}/check-badges`, {});
  }

  // Time analytics
  getTimeAnalytics(userId: string, period?: 'week' | 'month' | 'year'): Observable<TimeAnalytics> {
    let params = new HttpParams();
    if (period) {
      params = params.set('period', period);
    }
    
    return this.http.get<TimeAnalytics>(`${this.apiUrl}/user/${userId}/time-analytics`, { params });
  }

  getDailyStudyTime(userId: string, startDate: Date, endDate: Date): Observable<DailyStudyTime[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    return this.http.get<DailyStudyTime[]>(`${this.apiUrl}/user/${userId}/daily-study-time`, { params });
  }

  getWeeklyStudyTime(userId: string, weeks: number = 12): Observable<WeeklyStudyTime[]> {
    const params = new HttpParams().set('weeks', weeks.toString());
    return this.http.get<WeeklyStudyTime[]>(`${this.apiUrl}/user/${userId}/weekly-study-time`, { params });
  }

  getMonthlyStudyTime(userId: string, months: number = 12): Observable<MonthlyStudyTime[]> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<MonthlyStudyTime[]>(`${this.apiUrl}/user/${userId}/monthly-study-time`, { params });
  }

  // Subject analytics
  getSubjectAnalytics(userId: string): Observable<SubjectAnalytics[]> {
    return this.http.get<SubjectAnalytics[]>(`${this.apiUrl}/user/${userId}/subject-analytics`);
  }

  getSubjectPerformance(userId: string, subject: string): Observable<{
    averageScore: number;
    totalTime: number;
    completedTutorials: number;
    progressHistory: Array<{date: Date, score: number}>;
  }> {
    return this.http.get<{
      averageScore: number;
      totalTime: number;
      completedTutorials: number;
      progressHistory: Array<{date: Date, score: number}>;
    }>(`${this.apiUrl}/user/${userId}/subject/${subject}/performance`);
  }

  // Comparative analytics
  getClassAnalytics(classId: string): Observable<{
    averageStudyTime: number;
    averageScore: number;
    totalStudents: number;
    topPerformers: Array<{userId: string, userName: string, score: number}>;
    subjectBreakdown: Array<{subject: string, averageScore: number, participationRate: number}>;
  }> {
    return this.http.get<{
      averageStudyTime: number;
      averageScore: number;
      totalStudents: number;
      topPerformers: Array<{userId: string, userName: string, score: number}>;
      subjectBreakdown: Array<{subject: string, averageScore: number, participationRate: number}>;
    }>(`${this.apiUrl}/class/${classId}`);
  }

  getUserRankings(userId: string): Observable<{
    overallRank: number;
    totalUsers: number;
    subjectRankings: Array<{subject: string, rank: number, totalInSubject: number}>;
    percentile: number;
  }> {
    return this.http.get<{
      overallRank: number;
      totalUsers: number;
      subjectRankings: Array<{subject: string, rank: number, totalInSubject: number}>;
      percentile: number;
    }>(`${this.apiUrl}/user/${userId}/rankings`);
  }

  // Goals and targets
  setStudyGoal(userId: string, goal: {
    type: 'daily_minutes' | 'weekly_hours' | 'monthly_tutorials';
    target: number;
    startDate: Date;
    endDate?: Date;
  }): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/user/${userId}/goals`, goal);
  }

  getStudyGoals(userId: string): Observable<Array<{
    id: string;
    type: string;
    target: number;
    current: number;
    startDate: Date;
    endDate?: Date;
    isCompleted: boolean;
  }>> {
    return this.http.get<Array<{
      id: string;
      type: string;
      target: number;
      current: number;
      startDate: Date;
      endDate?: Date;
      isCompleted: boolean;
    }>>(`${this.apiUrl}/user/${userId}/goals`);
  }

  // Export functionality
  exportUserData(userId: string, format: 'pdf' | 'csv' | 'json'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/user/${userId}/export?format=${format}`, {
      responseType: 'blob'
    });
  }

  generateProgressReport(userId: string, period: 'week' | 'month' | 'quarter'): Observable<{
    reportUrl: string;
    reportData: any;
  }> {
    return this.http.get<{
      reportUrl: string;
      reportData: any;
    }>(`${this.apiUrl}/user/${userId}/progress-report?period=${period}`);
  }
}
