import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputComponent, ButtonComponent, Course } from '../../../shared';
import { ToastService } from '../../../core/services/toast.service';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-course-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);
  private readonly toast = inject(ToastService);

  isEdit = false;
  courseId: string | null = null;
  saving = false;
  allCourses: Course[] = [];
  selectedPrerequisites: string[] = [];

  form = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
  });

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.courseId;

    this.coursesService.getAll().subscribe((courses) => {
      this.allCourses = courses.filter((c) => c._id !== this.courseId);
    });

    if (this.isEdit) {
      this.coursesService.getOne(this.courseId!).subscribe((course) => {
        this.form.patchValue({
          code: course.code,
          name: course.name,
          description: course.description ?? '',
        });
        this.selectedPrerequisites = course.prerequisites.map((p) => p._id);
      });
    }
  }

  fieldError(field: string): string {
    const c = this.form.get(field);
    if (!c?.invalid || !c.touched) return '';
    if (c.errors?.['required']) return 'This field is required';
    if (c.errors?.['maxlength']) return 'Too long';
    return '';
  }

  isPrerequisite(id: string): boolean {
    return this.selectedPrerequisites.includes(id);
  }

  togglePrerequisite(id: string): void {
    if (this.isPrerequisite(id)) {
      this.selectedPrerequisites = this.selectedPrerequisites.filter(
        (p) => p !== id,
      );
    } else {
      this.selectedPrerequisites = [...this.selectedPrerequisites, id];
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const { code, name, description } = this.form.value;

    const req = this.isEdit
      ? this.coursesService.updateCourse(this.courseId!, {
          name: name!,
          description: description ?? undefined,
          prerequisites: this.selectedPrerequisites,
        })
      : this.coursesService.createCourse({
          code: code!,
          name: name!,
          description: description ?? undefined,
          prerequisites: this.selectedPrerequisites,
        });

    req.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Course updated.' : 'Course created.');
        this.router.navigate(['/courses']);
      },
      error: () => (this.saving = false),
    });
  }
}
