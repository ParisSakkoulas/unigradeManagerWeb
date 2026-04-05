import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../admin.service';
import { User } from '../../../shared/models';
import { Role } from '../../../core/auth/role.enum';
import {
  TableComponent,
  TableColumn,
} from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { RoleLabelPipe } from '../../../shared/pipes/role-label.pipe';
import { ToastService } from '../../../core/services/toast.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent, SpinnerComponent } from '../../../shared';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
    SpinnerComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);

  userId = '';
  loading = false;
  saving = false;

  readonly roleOptions = [
    { value: Role.STUDENT, label: 'Student' },
    { value: Role.INSTRUCTOR, label: 'Instructor' },
    { value: Role.ADMIN, label: 'Administrator' },
  ];

  form = this.fb.group({
    login: ['', [Validators.required, Validators.minLength(3)]],
    password: [''],
    role: [Role.STUDENT, Validators.required],
    isApproved: [false],
  });

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.adminService.getUser(this.userId).subscribe({
      next: (user) => {
        this.form.patchValue({
          login: user.login,
          role: user.role,
          isApproved: user.isApproved,
        });
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  fieldError(field: string): string {
    const c = this.form.get(field);
    if (!c?.invalid || !c.touched) return '';
    if (c.errors?.['required']) return 'Required';
    if (c.errors?.['minlength']) return 'Too short';
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;

    const { login, password, role, isApproved } = this.form.value;
    const body: any = { login, role, isApproved };
    if (password) body.password = password;

    this.adminService.updateUser(this.userId, body).subscribe({
      next: () => {
        this.toast.success('User updated.');
        this.router.navigate(['/admin']);
      },
      error: () => (this.saving = false),
    });
  }
}
