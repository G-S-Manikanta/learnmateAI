import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TutorialService } from '../../services/tutorial.service';
import { Tutorial } from '../../models/tutorial.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  featuredTutorials: Tutorial[] = [];
  popularTutorials: Tutorial[] = [];
  subjects: string[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private tutorialService: TutorialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    this.loadHomePageData();
  }

  private checkAuthStatus(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  private loadHomePageData(): void {
    // Load featured tutorials (simulated data for now)
    this.featuredTutorials = [
      {
        id: '1',
        title: 'Introduction to Machine Learning',
        description: 'Learn the basics of machine learning and AI',
        subject: 'Computer Science',
        difficulty: 'beginner' as any,
        estimatedDuration: 120,
        thumbnail: 'assets/images/ml-intro.jpg',
        content: [],
        tags: ['AI', 'ML', 'Python'],
        createdBy: 'instructor1',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        rating: 4.5,
        totalRatings: 256
      },
      {
        id: '2',
        title: 'Web Development Fundamentals',
        description: 'Master HTML, CSS, and JavaScript',
        subject: 'Web Development',
        difficulty: 'beginner' as any,
        estimatedDuration: 180,
        thumbnail: 'assets/images/web-dev.jpg',
        content: [],
        tags: ['HTML', 'CSS', 'JavaScript'],
        createdBy: 'instructor2',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        rating: 4.7,
        totalRatings: 189
      }
    ];

    this.popularTutorials = [
      {
        id: '3',
        title: 'Data Structures and Algorithms',
        description: 'Essential computer science concepts',
        subject: 'Computer Science',
        difficulty: 'intermediate' as any,
        estimatedDuration: 240,
        thumbnail: 'assets/images/dsa.jpg',
        content: [],
        tags: ['Algorithms', 'Data Structures', 'Programming'],
        createdBy: 'instructor3',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        rating: 4.8,
        totalRatings: 342
      }
    ];

    this.subjects = [
      'Computer Science',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'History',
      'Literature',
      'Languages'
    ];

    this.isLoading = false;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToTutorial(tutorialId: string): void {
    this.router.navigate(['/tutorial', tutorialId]);
  }

  exploreSubject(subject: string): void {
    this.router.navigate(['/tutorials'], { queryParams: { subject } });
  }

  getStarted(): void {
    if (this.isAuthenticated) {
      this.navigateToDashboard();
    } else {
      this.navigateToLogin();
    }
  }
}
