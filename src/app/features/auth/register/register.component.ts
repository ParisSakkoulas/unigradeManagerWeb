import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/auth/role.enum';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  loading = false;
  submitted = false;
  errorMsg = '';

  readonly roleOptions = [
    { label: 'Student', value: Role.STUDENT },
    { label: 'Instructor', value: Role.INSTRUCTOR },
  ];

  form = this.fb.group({
    login: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(72)],
    ],
    role: [Role.STUDENT, Validators.required],
  });

  fieldError(field: string): string {
    const control = this.form.get(field);
    if (!control?.invalid || !control.touched) return '';
    if (control.errors?.['required']) return `This field is required`;
    if (control.errors?.['minlength']) return `Too short`;
    if (control.errors?.['maxlength']) return `Too long`;
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const { login, password, role } = this.form.value;

    this.auth
      .register(login!, password!, role as Role.STUDENT | Role.INSTRUCTOR)
      .subscribe({
        next: () => {
          this.submitted = true;
          this.loading = false;
        },
        error: (err) => {
          this.errorMsg =
            err.error?.message ?? 'Registration failed. Please try again.';
          this.loading = false;
        },
      });
  }
}
