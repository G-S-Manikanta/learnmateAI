import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user && authService.isAuthenticated()) {
        return true;
      }
      
      // Store the attempted URL for redirecting after login (only in browser)
      if (isPlatformBrowser(platformId)) {
        localStorage.setItem('redirectUrl', state.url);
      }
      
      // Redirect to login page
      router.navigate(['/login']);
      return false;
    })
  );
};
