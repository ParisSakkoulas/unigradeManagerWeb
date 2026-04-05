import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputComponent, ButtonComponent } from '../../../shared';
import { ToastService } from '../../../core/services/toast.service';
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-student-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss',
})
export class StudentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly studentsService = inject(StudentsService);
  private readonly toast = inject(ToastService);

  isEdit = false;
  studentId: string | null = null;
  saving = false;

  form = this.fb.group({
    registrationNumber: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    enrollmentYear: [new Date().getFullYear(), Validators.required],
    userId: [''],
  });

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.studentId;
    if (!this.isEdit) {
      this.form.get('registrationNumber')!.setValidators(Validators.required);
      this.form.get('userId')!.setValidators(Validators.required);
    }
    if (this.isEdit) {
      this.studentsService.getOne(this.studentId!).subscribe((s) => {
        this.form.patchValue({
          firstName: s.firstName,
          lastName: s.lastName,
          enrollmentYear: s.enrollmentYear,
        });
      });
    }
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
    const v = this.form.value;

    const req = this.isEdit
      ? this.studentsService.updateStudent(this.studentId!, {
          firstName: v.firstName!,
          lastName: v.lastName!,
          enrollmentYear: v.enrollmentYear!,
        })
      : this.studentsService.createStudent({
          registrationNumber: v.registrationNumber!,
          firstName: v.firstName!,
          lastName: v.lastName!,
          enrollmentYear: v.enrollmentYear!,
          userId: v.userId!,
        });

    req.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Updated.' : 'Created.');
        this.router.navigate(['/students']);
      },
      error: () => (this.saving = false),
    });
  }
}
