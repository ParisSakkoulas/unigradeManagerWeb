import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/role.guard';
import { Role } from '../../core/auth/role.enum';

export const STUDENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./student-list/student-list.component').then(
        (m) => m.StudentListComponent,
      ),
  },
  {
    path: 'new',
    canActivate: [roleGuard([Role.ADMIN])],
    loadComponent: () =>
      import('./student-form/student-form.component').then(
        (m) => m.StudentFormComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./student-detail/student-detail.component').then(
        (m) => m.StudentDetailComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./student-form/student-form.component').then(
        (m) => m.StudentFormComponent,
      ),
  },
];
