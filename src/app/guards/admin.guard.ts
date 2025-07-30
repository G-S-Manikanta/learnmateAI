import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user && authService.isAuthenticated()) {
        // Check if user has admin role
        if (user.role === UserRole.ADMIN) {
          return true;
        }
        
        // User is authenticated but not admin
        router.navigate(['/dashboard']);
        return false;
      }
      
      // User is not authenticated - store the attempted URL for redirecting after login (only in browser)
      if (isPlatformBrowser(platformId)) {
        localStorage.setItem('redirectUrl', state.url);
      }
      router.navigate(['/login']);
      return false;
    })
  );
};
