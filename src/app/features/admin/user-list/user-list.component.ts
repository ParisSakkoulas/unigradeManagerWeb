import { Component, inject, OnInit } from '@angular/core';
import { Role } from '../../../core/auth/role.enum';
import { ToastService } from '../../../core/services/toast.service';
import {
  User,
  TableColumn,
  BadgeComponent,
  ButtonComponent,
  ConfirmDialogComponent,
  RoleLabelPipe,
  TableComponent,
} from '../../../shared';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    RouterLink,
    TableComponent,
    ButtonComponent,
    BadgeComponent,
    ConfirmDialogComponent,
    RoleLabelPipe,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);

  readonly Role = Role;

  users: User[] = [];
  pendingUsers: User[] = [];
  loading = false;
  deleting = false;
  approvingId = '';
  toDelete: User | null = null;

  readonly columns: TableColumn<User>[] = [
    { key: 'login', label: 'Login', sortable: true },
    { key: 'role', label: 'Role', render: (row) => row.role },
    {
      key: 'isApproved',
      label: 'Status',
      render: (row) => (row.isApproved ? 'Approved' : 'Pending'),
    },
    {
      key: 'createdAt',
      label: 'Registered',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users.filter((u) => u.isApproved);
        this.pendingUsers = users.filter((u) => !u.isApproved);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  approve(user: User): void {
    this.approvingId = user._id;
    this.adminService.approveUser(user._id).subscribe({
      next: () => {
        this.toast.success(`${user.login} approved.`);
        this.approvingId = '';
        this.load();
      },
      error: () => (this.approvingId = ''),
    });
  }

  onDelete(): void {
    if (!this.toDelete) return;
    this.deleting = true;
    this.adminService.deleteUser(this.toDelete._id).subscribe({
      next: () => {
        this.toast.success('User deleted.');
        this.toDelete = null;
        this.deleting = false;
        this.load();
      },
      error: () => (this.deleting = false),
    });
  }
}
