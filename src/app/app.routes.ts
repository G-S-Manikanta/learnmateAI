import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'study-companion', 
    loadComponent: () => import('./components/study-companion/study-companion.component').then(m => m.StudyCompanionComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'analytics', 
    loadComponent: () => import('./components/analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'ai-tutor', 
    loadComponent: () => import('./components/ai-tutor/ai-tutor.component').then(m => m.AiTutorComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
