import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './role.enum';

/**
 * Usage in routes:
 *   canActivate: [authGuard, roleGuard([Role.ADMIN, Role.INSTRUCTOR])]
 */
export const roleGuard = (roles: Role[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.hasRole(...roles)) return true;

    // Authenticated but wrong role → redirect to dashboard
    router.navigate(['/dashboard']);
    return false;
  };
};
