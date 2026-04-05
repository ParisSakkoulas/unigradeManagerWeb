import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/role.guard';
import { Role } from '../../core/auth/role.enum';

export const STATISTICS_ROUTES: Routes = [
  {
    path: 'instructor',
    canActivate: [roleGuard([Role.INSTRUCTOR, Role.ADMIN])],
    loadComponent: () =>
      import('./instructor-stats/instructor-stats.component').then(
        (m) => m.InstructorStatsComponent,
      ),
  },
  {
    path: 'student',
    canActivate: [roleGuard([Role.STUDENT, Role.ADMIN])],
    loadComponent: () =>
      import('./student-stats/student-stats.component').then(
        (m) => m.StudentStatsComponent,
      ),
  },
  { path: '', redirectTo: 'instructor', pathMatch: 'full' },
];
