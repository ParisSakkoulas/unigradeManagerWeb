import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ButtonComponent,
  BadgeComponent,
  ConfirmDialogComponent,
  SpinnerComponent,
  HasRoleDirective,
  Course,
} from '../../../shared';
import { Role } from '../../../core/auth/role.enum';
import { ToastService } from '../../../core/services/toast.service';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-course-detail',
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    BadgeComponent,
    ConfirmDialogComponent,
    SpinnerComponent,
    HasRoleDirective,
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);
  private readonly toast = inject(ToastService);

  readonly Role = Role;

  course: Course | null = null;
  loading = false;
  showDelete = false;
  deleting = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.coursesService.getOne(id).subscribe({
      next: (c) => {
        this.course = c;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onDelete(): void {
    if (!this.course) return;
    this.deleting = true;
    this.coursesService.deleteCourse(this.course._id).subscribe({
      next: () => {
        this.toast.success('Course deleted.');
        this.router.navigate(['/courses']);
      },
      error: () => (this.deleting = false),
    });
  }
}
