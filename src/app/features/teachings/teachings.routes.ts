import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/role.guard';
import { Role } from '../../core/auth/role.enum';

export const TEACHINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./teaching-list/teaching-list.component').then(
        (m) => m.TeachingListComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./teaching-detail/teaching-detail.component').then(
        (m) => m.TeachingDetailComponent,
      ),
  },
  {
    path: ':id/grading',
    canActivate: [roleGuard([Role.INSTRUCTOR, Role.ADMIN])],
    loadComponent: () =>
      import('./grading-form/grading-form.component').then(
        (m) => m.GradingFormComponent,
      ),
  },
];
