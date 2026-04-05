import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-list/user-list.component').then(
        (m) => m.UserListComponent,
      ),
  },
  {
    path: 'users/:id/edit',
    loadComponent: () =>
      import('./user-form/user-form.component').then(
        (m) => m.UserFormComponent,
      ),
  },
];
