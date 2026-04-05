import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ButtonComponent } from '../../../shared';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  errorMsg = '';

  form = this.fb.group({
    login: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  fieldError(field: string): string {
    const control = this.form.get(field);
    if (!control?.invalid || !control.touched) return '';
    if (control.errors?.['required']) return `${field} is required`;
    if (control.errors?.['minlength']) return `Too short`;
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const { login, password } = this.form.value;

    this.auth.login(login!, password!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg = err.error?.message ?? 'Invalid credentials';
        this.loading = false;
      },
    });
  }
}
