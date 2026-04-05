import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { roleGuard } from './core/auth/role.guard';
import { Role } from './core/auth/role.enum';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // Protected shell
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'courses',
        loadChildren: () =>
          import('./features/courses/courses.routes').then(
            (m) => m.COURSES_ROUTES,
          ),
      },
      {
        path: 'teachings',
        loadChildren: () =>
          import('./features/teachings/teachings.routes').then(
            (m) => m.TEACHINGS_ROUTES,
          ),
      },
      {
        path: 'declarations',
        loadChildren: () =>
          import('./features/declarations/declarations.routes').then(
            (m) => m.DECLARATIONS_ROUTES,
          ),
      },
      {
        path: 'students',
        canActivate: [roleGuard([Role.ADMIN, Role.INSTRUCTOR])],
        loadChildren: () =>
          import('./features/students/students.routes').then(
            (m) => m.STUDENTS_ROUTES,
          ),
      },
      {
        path: 'instructors',
        canActivate: [roleGuard([Role.ADMIN])],
        loadChildren: () =>
          import('./features/instructors/instructors.route').then(
            (m) => m.INSTRUCTORS_ROUTES,
          ),
      },
      {
        path: 'statistics',
        loadChildren: () =>
          import('./features/statistics/statistics.routes').then(
            (m) => m.STATISTICS_ROUTES,
          ),
      },
      {
        path: 'admin',
        canActivate: [roleGuard([Role.ADMIN])],
        loadChildren: () =>
          import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'dashboard' },
];
