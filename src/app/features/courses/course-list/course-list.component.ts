import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  TableComponent,
  ButtonComponent,
  InputComponent,
  ConfirmDialogComponent,
  HasRoleDirective,
  Course,
  TableColumn,
} from '../../../shared';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/auth/role.enum';
import { ToastService } from '../../../core/services/toast.service';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-course-list',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    InputComponent,
    ConfirmDialogComponent,
    HasRoleDirective,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  private readonly coursesService = inject(CoursesService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly Role = Role;

  courses: Course[] = [];
  loading = false;
  deleting = false;
  courseToDelete: Course | null = null;

  searchCtrl = new FormControl('');

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  readonly columns: TableColumn<Course>[] = [
    { key: 'code', label: 'Code', sortable: true, width: '120px' },
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'prerequisites',
      label: 'Prerequisites',
      render: (row) =>
        row.prerequisites?.length
          ? row.prerequisites.map((p: any) => p.code).join(', ')
          : '—',
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => row.description ?? '—',
    },
  ];

  ngOnInit(): void {
    this.load();

    this.searchCtrl.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe((q) => this.load(q ?? ''));
  }

  load(q = ''): void {
    this.loading = true;
    const req = q
      ? this.coursesService.search(q)
      : this.coursesService.getAll();
    req.subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onRowClick(course: Course): void {
    this.router.navigate(['/courses', course._id]);
  }

  confirmDelete(course: Course): void {
    this.courseToDelete = course;
  }

  onDelete(): void {
    if (!this.courseToDelete) return;
    this.deleting = true;
    this.coursesService.deleteCourse(this.courseToDelete._id).subscribe({
      next: () => {
        this.toast.success('Course deleted.');
        this.courses = this.courses.filter(
          (c) => c._id !== this.courseToDelete!._id,
        );
        this.courseToDelete = null;
        this.deleting = false;
      },
      error: () => (this.deleting = false),
    });
  }
}
