import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/role.guard';
import { Role } from '../../core/auth/role.enum';

export const INSTRUCTORS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard([Role.ADMIN])],
    loadComponent: () =>
      import('./instructor-list/instructor-list.component').then(
        (m) => m.InstructorListComponent,
      ),
  },
  {
    path: 'new',
    canActivate: [roleGuard([Role.ADMIN])],
    loadComponent: () =>
      import('./instructor-form/instructor-form.component').then(
        (m) => m.InstructorFormComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./instructor-detail/instructor-detail.component').then(
        (m) => m.InstructorDetailComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./instructor-form/instructor-form.component').then(
        (m) => m.InstructorFormComponent,
      ),
  },
];
