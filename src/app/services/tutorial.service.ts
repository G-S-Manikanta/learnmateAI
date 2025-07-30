import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { 
  Tutorial, 
  TutorialProgress, 
  DifficultyLevel, 
  Quiz, 
  Question 
} from '../models/tutorial.model';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private apiUrl = 'http://localhost:3000/api/tutorials'; // Replace with your API URL
  private currentTutorialSubject = new BehaviorSubject<Tutorial | null>(null);
  public currentTutorial$ = this.currentTutorialSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Tutorial CRUD operations
  getAllTutorials(filters?: {
    subject?: string;
    difficulty?: DifficultyLevel;
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<{tutorials: Tutorial[], total: number, page: number, totalPages: number}> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.subject) params = params.set('subject', filters.subject);
      if (filters.difficulty) params = params.set('difficulty', filters.difficulty);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<{tutorials: Tutorial[], total: number, page: number, totalPages: number}>(`${this.apiUrl}`, { params });
  }

  getTutorialById(id: string): Observable<Tutorial> {
    return this.http.get<Tutorial>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(tutorial => this.currentTutorialSubject.next(tutorial))
      );
  }

  getRecommendedTutorials(userId: string): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${this.apiUrl}/recommended/${userId}`);
  }

  getTutorialsBySubject(subject: string): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${this.apiUrl}/subject/${subject}`);
  }

  getPopularTutorials(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${this.apiUrl}/popular`);
  }

  searchTutorials(query: string): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  createTutorial(tutorial: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt'>): Observable<Tutorial> {
    return this.http.post<Tutorial>(`${this.apiUrl}`, tutorial);
  }

  updateTutorial(id: string, tutorial: Partial<Tutorial>): Observable<Tutorial> {
    return this.http.put<Tutorial>(`${this.apiUrl}/${id}`, tutorial);
  }

  deleteTutorial(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/${id}`);
  }

  // Progress tracking
  getUserProgress(userId: string, tutorialId: string): Observable<TutorialProgress> {
    return this.http.get<TutorialProgress>(`${this.apiUrl}/${tutorialId}/progress/${userId}`);
  }

  updateProgress(userId: string, tutorialId: string, contentId: string): Observable<TutorialProgress> {
    return this.http.put<TutorialProgress>(`${this.apiUrl}/${tutorialId}/progress/${userId}`, {
      contentId,
      timestamp: new Date()
    });
  }

  markTutorialComplete(userId: string, tutorialId: string): Observable<TutorialProgress> {
    return this.http.put<TutorialProgress>(`${this.apiUrl}/${tutorialId}/complete/${userId}`, {
      completedAt: new Date()
    });
  }

  getUserAllProgress(userId: string): Observable<TutorialProgress[]> {
    return this.http.get<TutorialProgress[]>(`${this.apiUrl}/progress/user/${userId}`);
  }

  // Rating and feedback
  rateTutorial(tutorialId: string, userId: string, rating: number, review?: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/${tutorialId}/rate`, {
      userId,
      rating,
      review
    });
  }

  getTutorialRatings(tutorialId: string): Observable<{
    averageRating: number;
    totalRatings: number;
    reviews: Array<{userId: string, rating: number, review?: string, createdAt: Date}>;
  }> {
    return this.http.get<{
      averageRating: number;
      totalRatings: number;
      reviews: Array<{userId: string, rating: number, review?: string, createdAt: Date}>;
    }>(`${this.apiUrl}/${tutorialId}/ratings`);
  }

  // Quiz functionality
  getQuiz(tutorialId: string, contentId: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${tutorialId}/content/${contentId}/quiz`);
  }

  submitQuizAnswers(
    tutorialId: string, 
    contentId: string, 
    userId: string, 
    answers: {questionId: string, answer: string | string[]}[]
  ): Observable<{
    score: number;
    passed: boolean;
    results: Array<{questionId: string, correct: boolean, correctAnswer: string | string[]}>;
  }> {
    return this.http.post<{
      score: number;
      passed: boolean;
      results: Array<{questionId: string, correct: boolean, correctAnswer: string | string[]}>;
    }>(`${this.apiUrl}/${tutorialId}/content/${contentId}/quiz/submit`, {
      userId,
      answers
    });
  }

  // Study session tracking
  startStudySession(userId: string, tutorialId: string): Observable<{sessionId: string}> {
    return this.http.post<{sessionId: string}>(`${this.apiUrl}/${tutorialId}/session/start`, {
      userId,
      startTime: new Date()
    });
  }

  endStudySession(sessionId: string): Observable<{totalTime: number}> {
    return this.http.put<{totalTime: number}>(`${this.apiUrl}/session/${sessionId}/end`, {
      endTime: new Date()
    });
  }

  // Subjects and categories
  getAllSubjects(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/subjects`);
  }

  getSubjectStatistics(): Observable<Array<{subject: string, tutorialCount: number, avgRating: number}>> {
    return this.http.get<Array<{subject: string, tutorialCount: number, avgRating: number}>>(`${this.apiUrl}/subjects/statistics`);
  }
}
