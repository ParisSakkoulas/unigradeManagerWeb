import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  InputComponent,
  ButtonComponent,
  BadgeComponent,
  SpinnerComponent,
} from '../../../shared';
import {
  Instructor,
  InstructorRank,
  InstructorRankLabel,
} from '../../../shared/models/instructor.model';
import { Student } from '../../../shared/models/student.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/auth/role.enum';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';
import { StudentsService } from '../../students/students.service';
import { InstructorsService } from '../../teachings/instructors.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    BadgeComponent,
    SpinnerComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly instructorsService = inject(InstructorsService);
  private readonly studentsService = inject(StudentsService);
  private readonly toast = inject(ToastService);

  profile: Instructor | Student | null = null;
  loadingProfile = false;
  saving = false;

  form = this.fb.group({
    login: ['', [Validators.required, Validators.minLength(3)]],
    password: [''],
    confirmPassword: [''],
  });

  get isStudent(): boolean {
    return this.auth.role() === Role.STUDENT;
  }
  get isInstructor(): boolean {
    return this.auth.role() === Role.INSTRUCTOR;
  }
  get isAdmin(): boolean {
    return this.auth.role() === Role.ADMIN;
  }

  get studentProfile(): Student | null {
    return this.isStudent ? (this.profile as Student) : null;
  }

  get instructorProfile(): Instructor | null {
    return this.isInstructor ? (this.profile as Instructor) : null;
  }

  get initials(): string {
    const login = this.auth.user()?.login ?? '?';
    return login.slice(0, 2).toUpperCase();
  }

  get roleLabel(): string {
    const map: Record<Role, string> = {
      [Role.ADMIN]: 'Administrator',
      [Role.INSTRUCTOR]: 'Instructor',
      [Role.STUDENT]: 'Student',
      [Role.GUEST]: 'Guest',
    };
    return map[this.auth.role()] ?? this.auth.role();
  }

  get rankLabel(): string {
    const rank = this.instructorProfile?.rank;
    return rank ? (InstructorRankLabel[rank] ?? rank) : '';
  }

  get passwordMismatch(): boolean {
    const { password, confirmPassword } = this.form.value;
    return !!password && !!confirmPassword && password !== confirmPassword;
  }

  ngOnInit(): void {
    this.form.patchValue({ login: this.auth.user()?.login ?? '' });
    this.loadProfile();
  }

  loadProfile(): void {
    if (this.isAdmin) return;
    this.loadingProfile = true;

    if (this.isInstructor) {
      this.instructorsService.getMyProfile().subscribe({
        next: (p: Instructor) => {
          this.profile = p;
          this.loadingProfile = false;
        },
        error: () => (this.loadingProfile = false),
      });
    } else {
      this.studentsService.getMyProfile().subscribe({
        next: (p: Student) => {
          this.profile = p;
          this.loadingProfile = false;
        },
        error: () => (this.loadingProfile = false),
      });
    }
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
    if (this.passwordMismatch) return;

    this.saving = true;
    const { login, password } = this.form.value;
    const body: any = { login };
    if (password) body.password = password;

    this.http.patch(`${environment.apiUrl}/auth/me`, body).subscribe({
      next: () => {
        this.toast.success('Profile updated. Please log in again.');
        setTimeout(() => this.auth.logout(), 1500);
      },
      error: () => (this.saving = false),
    });
  }
}
