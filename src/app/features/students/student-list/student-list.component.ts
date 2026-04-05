import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/auth/role.enum';
import { ToastService } from '../../../core/services/toast.service';
import {
  ButtonComponent,
  ConfirmDialogComponent,
  HasRoleDirective,
  Student,
  TableColumn,
  TableComponent,
} from '../../../shared';
import { StudentsService } from '../students.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-list',
  imports: [
    CommonModule,
    RouterLink,
    TableComponent,
    ButtonComponent,
    ConfirmDialogComponent,
    HasRoleDirective,
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
})
export class StudentListComponent implements OnInit {
  private readonly studentsService = inject(StudentsService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly Role = Role;
  students: Student[] = [];
  loading = false;
  deleting = false;
  toDelete: Student | null = null;

  readonly columns: TableColumn<Student>[] = [
    { key: 'registrationNumber', label: 'AM', sortable: true, width: '120px' },
    { key: 'firstName', label: 'First name', sortable: true },
    { key: 'lastName', label: 'Last name', sortable: true },
    { key: 'enrollmentYear', label: 'Year', sortable: true, width: '80px' },
  ];

  ngOnInit(): void {
    this.loading = true;
    this.studentsService.getAll().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onRowClick(s: Student): void {
    this.router.navigate(['/students', s._id]);
  }

  onDelete(): void {
    if (!this.toDelete) return;
    this.deleting = true;
    this.studentsService.deleteStudent(this.toDelete._id).subscribe({
      next: () => {
        this.toast.success('Student deleted.');
        this.students = this.students.filter(
          (s) => s._id !== this.toDelete!._id,
        );
        this.toDelete = null;
        this.deleting = false;
      },
      error: () => (this.deleting = false),
    });
  }
}
