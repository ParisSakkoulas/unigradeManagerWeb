import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';
import { roleGuard } from '../../core/auth/role.guard';
import { Role } from '../../core/auth/role.enum';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./course-list/course-list.component').then(
        (m) => m.CourseListComponent,
      ),
  },
  {
    path: 'new',
    canActivate: [roleGuard([Role.ADMIN])],
    loadComponent: () =>
      import('./course-form/course-form.component').then(
        (m) => m.CourseFormComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./course-detail/course-detail.component').then(
        (m) => m.CourseDetailComponent,
      ),
  },
  {
    path: ':id/edit',
    canActivate: [roleGuard([Role.ADMIN])],
    loadComponent: () =>
      import('./course-form/course-form.component').then(
        (m) => m.CourseFormComponent,
      ),
  },
];
