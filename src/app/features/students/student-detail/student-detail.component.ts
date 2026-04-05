import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ButtonComponent,
  SpinnerComponent,
  HasRoleDirective,
  Student,
} from '../../../shared';
import { Role } from '../../../core/auth/role.enum';
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-student-detail',
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    SpinnerComponent,
    HasRoleDirective,
  ],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss',
})
export class StudentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly studentsService = inject(StudentsService);

  readonly Role = Role;
  student: Student | null = null;
  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.studentsService.getOne(id).subscribe({
      next: (s) => {
        this.student = s;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
