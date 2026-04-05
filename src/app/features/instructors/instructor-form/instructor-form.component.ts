import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  InputComponent,
  ButtonComponent,
  InstructorRank,
  InstructorRankLabel,
} from '../../../shared';
import { ToastService } from '../../../core/services/toast.service';
import { InstructorsService } from '../instructors.service';

@Component({
  selector: 'app-instructor-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './instructor-form.component.html',
  styleUrl: './instructor-form.component.scss',
})
export class InstructorFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly instructorsService = inject(InstructorsService);
  private readonly toast = inject(ToastService);

  isEdit = false;
  instructorId: string | null = null;
  saving = false;

  readonly ranks = Object.values(InstructorRank).map((v) => ({
    value: v,
    label: InstructorRankLabel[v],
  }));

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    rank: [InstructorRank.ASSISTANT, Validators.required],
    userId: [''],
  });

  ngOnInit(): void {
    this.instructorId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.instructorId;
    if (this.isEdit) {
      this.instructorsService.getOne(this.instructorId!).subscribe((i) => {
        this.form.patchValue({
          firstName: i.firstName,
          lastName: i.lastName,
          rank: i.rank,
        });
      });
    }
    if (!this.isEdit)
      this.form.get('userId')!.setValidators(Validators.required);
  }

  fieldError(field: string): string {
    const c = this.form.get(field);
    if (!c?.invalid || !c.touched) return '';
    return 'This field is required';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const { firstName, lastName, rank, userId } = this.form.value;

    const req = this.isEdit
      ? this.instructorsService.updateInstructor(this.instructorId!, {
          firstName: firstName!,
          lastName: lastName!,
          rank: rank!,
        })
      : this.instructorsService.createInstructor({
          firstName: firstName!,
          lastName: lastName!,
          rank: rank!,
          userId: userId!,
        });

    req.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Updated.' : 'Created.');
        this.router.navigate(['/instructors']);
      },
      error: () => (this.saving = false),
    });
  }
}
