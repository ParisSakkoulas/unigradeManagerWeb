import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/role.guard';
import { Role } from '../../core/auth/role.enum';

export const DECLARATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./declaration-list/declaration-list.component').then(
        (m) => m.DeclarationListComponent,
      ),
  },
  {
    path: 'teaching/:teachingId/grade',
    canActivate: [roleGuard([Role.INSTRUCTOR, Role.ADMIN])],
    loadComponent: () =>
      import('./grade-entry/grade-entry.component').then(
        (m) => m.GradeEntryComponent,
      ),
  },
];
