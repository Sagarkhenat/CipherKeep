import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  //const isAuthenticated = false;

  // Check the signal's current value
  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Redirect unauthorized users back to the lock screen
    router.navigate(['/lock-screen']);
    return false;
  }
};
