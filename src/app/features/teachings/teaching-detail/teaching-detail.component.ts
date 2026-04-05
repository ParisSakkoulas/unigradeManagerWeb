import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TeachingsService } from '../teachings.service';
import { InstructorsService } from '../../instructors/instructors.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/auth/role.enum';
import {
  Teaching,
  TeachingState,
  TeachingStateLabel,
  SemesterLabel,
  Semester,
  Instructor,
} from '../../../shared/models';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { RoleLabelPipe } from '../../../shared/pipes/role-label.pipe';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-teaching-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    ButtonComponent,
    BadgeComponent,
    SpinnerComponent,
    ConfirmDialogComponent,
    HasRoleDirective,
    RoleLabelPipe,
    FormsModule,
  ],
  templateUrl: './teaching-detail.component.html',
  styleUrl: './teaching-detail.component.scss',
})
export class TeachingDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly teachingsService = inject(TeachingsService);
  private readonly instructorsService = inject(InstructorsService);
  private readonly toast = inject(ToastService);
  readonly auth = inject(AuthService);

  readonly Role = Role;
  readonly TeachingState = TeachingState;

  teaching: Teaching | null = null;
  instructors: Instructor[] = [];
  loading = false;
  acting = false;
  showFinalize = false;
  showExpire = false;
  selectedInstructorId = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.teachingsService.getOne(id).subscribe({
      next: (t) => {
        this.teaching = t;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });

    if (this.auth.isAdmin()) {
      this.instructorsService
        .getAll()
        .subscribe((data) => (this.instructors = data));
    }
  }

  assignInstructor(): void {
    if (!this.selectedInstructorId || !this.teaching) return;
    this.acting = true;
    this.teachingsService
      .assign(this.teaching._id, { instructorId: this.selectedInstructorId })
      .subscribe({
        next: (t) => {
          this.teaching = t;
          this.acting = false;
          this.toast.success('Instructor assigned.');
        },
        error: () => (this.acting = false),
      });
  }

  finalizeGrades(): void {
    if (!this.teaching) return;
    this.acting = true;
    this.teachingsService.finalize(this.teaching._id).subscribe({
      next: (t) => {
        this.teaching = t;
        this.acting = false;
        this.showFinalize = false;
        this.toast.success('Grades finalized.');
      },
      error: () => (this.acting = false),
    });
  }

  expireSemester(): void {
    if (!this.teaching) return;
    this.acting = true;
    this.teachingsService.expire(this.teaching._id).subscribe({
      next: (t) => {
        this.teaching = t;
        this.acting = false;
        this.showExpire = false;
        this.toast.success('Semester expired.');
      },
      error: () => (this.acting = false),
    });
  }
}
