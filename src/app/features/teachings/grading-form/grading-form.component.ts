import { Component, inject, OnInit } from '@angular/core';
import {
  ButtonComponent,
  InputComponent,
  SpinnerComponent,
  Teaching,
} from '../../../shared';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { TeachingsService } from '../teachings.service';

@Component({
  selector: 'app-grading-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
    SpinnerComponent,
  ],
  templateUrl: './grading-form.component.html',
  styleUrl: './grading-form.component.scss',
})
export class GradingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly teachingsService = inject(TeachingsService);
  private readonly toast = inject(ToastService);

  teachingId = '';
  teaching: Teaching | null = null;
  loading = false;
  saving = false;

  form = this.fb.group({
    theoryWeight: [
      null as number | null,
      [Validators.required, Validators.min(0), Validators.max(1)],
    ],
    labWeight: [
      null as number | null,
      [Validators.required, Validators.min(0), Validators.max(1)],
    ],
    theoryRetentionYear: [null as number | null],
    labRetentionYear: [null as number | null],
  });

  get weightSumError(): boolean {
    const t = this.form.value.theoryWeight ?? 0;
    const l = this.form.value.labWeight ?? 0;
    return this.form.touched && Math.abs(t + l - 1) > 0.001;
  }

  ngOnInit(): void {
    this.teachingId = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.teachingsService.getOne(this.teachingId).subscribe({
      next: (t) => {
        this.teaching = t;
        this.loading = false;
        if (t.theoryWeight !== null) {
          this.form.patchValue({
            theoryWeight: t.theoryWeight,
            labWeight: t.labWeight,
            theoryRetentionYear: t.theoryRetentionYear,
            labRetentionYear: t.labRetentionYear,
          });
        }
      },
      error: () => (this.loading = false),
    });
  }

  fieldError(field: string): string {
    const c = this.form.get(field);
    if (!c?.invalid || !c.touched) return '';
    if (c.errors?.['required']) return 'Required';
    if (c.errors?.['min'] || c.errors?.['max'])
      return 'Must be between 0 and 1';
    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.weightSumError) return;

    this.saving = true;
    const { theoryWeight, labWeight, theoryRetentionYear, labRetentionYear } =
      this.form.value;

    this.teachingsService
      .defineGrading(this.teachingId, {
        theoryWeight: theoryWeight!,
        labWeight: labWeight!,
        theoryRetentionYear: theoryRetentionYear ?? undefined,
        labRetentionYear: labRetentionYear ?? undefined,
      })
      .subscribe({
        next: () => {
          this.toast.success('Grading saved.');
          this.router.navigate(['/teachings', this.teachingId]);
        },
        error: () => (this.saving = false),
      });
  }
}
