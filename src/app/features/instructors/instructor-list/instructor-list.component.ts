import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  TableComponent,
  ButtonComponent,
  ConfirmDialogComponent,
  RoleLabelPipe,
  Instructor,
  InstructorRankLabel,
  TableColumn,
} from '../../../shared';
import { ToastService } from '../../../core/services/toast.service';
import { InstructorsService } from '../instructors.service';

@Component({
  selector: 'app-instructor-list',
  imports: [
    CommonModule,
    RouterLink,
    TableComponent,
    ButtonComponent,
    ConfirmDialogComponent,
    RoleLabelPipe,
  ],
  templateUrl: './instructor-list.component.html',
  styleUrl: './instructor-list.component.scss',
})
export class InstructorListComponent implements OnInit {
  private readonly instructorsService = inject(InstructorsService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  instructors: Instructor[] = [];
  loading = false;
  deleting = false;
  toDelete: Instructor | null = null;

  readonly columns: TableColumn<Instructor>[] = [
    { key: 'firstName', label: 'First name', sortable: true },
    { key: 'lastName', label: 'Last name', sortable: true },
    {
      key: 'rank',
      label: 'Rank',
      render: (row) => InstructorRankLabel[row.rank] ?? row.rank,
    },
  ];

  ngOnInit(): void {
    this.loading = true;
    this.instructorsService.getAll().subscribe({
      next: (data) => {
        this.instructors = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onRowClick(i: Instructor): void {
    this.router.navigate(['/instructors', i._id]);
  }

  onDelete(): void {
    if (!this.toDelete) return;
    this.deleting = true;
    this.instructorsService.deleteInstructor(this.toDelete._id).subscribe({
      next: () => {
        this.toast.success('Instructor deleted.');
        this.instructors = this.instructors.filter(
          (i) => i._id !== this.toDelete!._id,
        );
        this.toDelete = null;
        this.deleting = false;
      },
      error: () => (this.deleting = false),
    });
  }
}
