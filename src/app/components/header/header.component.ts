import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  searchQuery = '';
  isSearchExpanded = false;
  showProfileDropdown = false;
  currentRoute = '';
  isMenuOpen = false;

  navigationItems = [
    { 
      path: '/dashboard', 
      label: 'My Courses', 
      icon: '📚',
      description: 'View your enrolled courses'
    },
    { 
      path: '/analytics', 
      label: 'Analytics', 
      icon: '📊',
      description: 'Track your learning progress'
    },
    { 
      path: '/study-companion', 
      label: 'Assignments', 
      icon: '📝',
      description: 'Complete quizzes and assignments'
    },
    { 
      path: '/ai-tutor', 
      label: 'AI Tutor', 
      icon: '🤖',
      description: 'Get personalized help'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Track current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });

    // Close dropdowns when clicking outside
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.profile-dropdown-container')) {
          this.showProfileDropdown = false;
        }
        if (!target.closest('.search-container')) {
          this.isSearchExpanded = false;
        }
        if (!target.closest('.mobile-menu-container')) {
          this.isMenuOpen = false;
        }
      });
    }
  }

  toggleSearch(): void {
    this.isSearchExpanded = !this.isSearchExpanded;
    if (this.isSearchExpanded) {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement search functionality here
      // For now, just log the search query
    }
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  toggleMobileMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.showProfileDropdown = false;
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
    this.showProfileDropdown = false;
  }

  logout(): void {
    this.authService.logout();
    this.showProfileDropdown = false;
  }

  isActiveRoute(path: string): boolean {
    return this.currentRoute === path || this.currentRoute.startsWith(path + '/');
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || this.currentUser.email.charAt(0).toUpperCase();
  }

  getUserDisplayName(): string {
    if (!this.currentUser) return 'User';
    return this.currentUser.firstName && this.currentUser.lastName 
      ? `${this.currentUser.firstName} ${this.currentUser.lastName}`
      : this.currentUser.email;
  }
}
