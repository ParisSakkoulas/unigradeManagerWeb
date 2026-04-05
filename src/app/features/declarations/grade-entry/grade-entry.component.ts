import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  TableComponent,
  ButtonComponent,
  InputComponent,
  SpinnerComponent,
  GradePipe,
  BulkGradeEntry,
  Declaration,
  TableColumn,
  Teaching,
} from '../../../shared';
import { ToastService } from '../../../core/services/toast.service';
import { TeachingsService } from '../../teachings/teachings.service';
import { DeclarationsService } from '../declarations.service';

@Component({
  selector: 'app-grade-entry',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TableComponent,
    ButtonComponent,
    InputComponent,
    SpinnerComponent,
    GradePipe,
    FormsModule,
  ],
  templateUrl: './grade-entry.component.html',
  styleUrl: './grade-entry.component.scss',
})
export class GradeEntryComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly declarationsService = inject(DeclarationsService);
  private readonly teachingsService = inject(TeachingsService);
  private readonly toast = inject(ToastService);

  teachingId = '';
  teaching: Teaching | null = null;
  declarations: Declaration[] = [];
  loadingTeaching = false;
  loadingDeclarations = false;
  savingId = '';
  savingBulk = false;
  bulkText = '';
  bulkResult: { updated: number; notFound: string[] } | null = null;
  activeTab = 'single';

  readonly tabs = [
    { key: 'single', label: 'Single entry' },
    { key: 'bulk', label: 'Bulk import' },
  ];

  // Track edits per row
  private edits: Record<string, { theory?: number; lab?: number }> = {};

  readonly columns: TableColumn<Declaration>[] = [
    {
      key: 'student',
      label: 'Student',
      render: (row) =>
        `${(row.student as any)?.registrationNumber} — ${(row.student as any)?.firstName} ${(row.student as any)?.lastName}`,
    },
    {
      key: 'theoryGrade',
      label: 'Theory',
      align: 'center',
      render: (row) => row.theoryGrade?.toFixed(2) ?? '—',
    },
    {
      key: 'labGrade',
      label: 'Lab',
      align: 'center',
      render: (row) => row.labGrade?.toFixed(2) ?? '—',
    },
    {
      key: 'finalGrade',
      label: 'Final',
      align: 'center',
      render: (row) => row.finalGrade?.toFixed(2) ?? '—',
    },
  ];

  ngOnInit(): void {
    this.teachingId = this.route.snapshot.paramMap.get('teachingId')!;
    this.loadingTeaching = true;
    this.teachingsService.getOne(this.teachingId).subscribe({
      next: (t) => {
        this.teaching = t;
        this.loadingTeaching = false;
        this.loadDeclarations();
      },
      error: () => (this.loadingTeaching = false),
    });
  }

  loadDeclarations(): void {
    this.loadingDeclarations = true;
    this.declarationsService.query({ teachingId: this.teachingId }).subscribe({
      next: (data) => {
        this.declarations = data;
        this.loadingDeclarations = false;
      },
      error: () => (this.loadingDeclarations = false),
    });
  }

  onGradeChange(row: Declaration, field: 'theory' | 'lab', event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    if (!this.edits[row._id]) this.edits[row._id] = {};
    if (field === 'theory')
      this.edits[row._id].theory = isNaN(val) ? undefined : val;
    if (field === 'lab') this.edits[row._id].lab = isNaN(val) ? undefined : val;
  }

  saveGrade(row: Declaration): void {
    const edit = this.edits[row._id] ?? {};
    this.savingId = row._id;
    this.declarationsService
      .setGrade(row._id, {
        theoryGrade: edit.theory,
        labGrade: edit.lab,
      })
      .subscribe({
        next: (updated) => {
          this.declarations = this.declarations.map((d) =>
            d._id === updated._id ? updated : d,
          );
          this.savingId = '';
          this.toast.success('Grade saved.');
        },
        error: () => (this.savingId = ''),
      });
  }

  submitBulk(): void {
    const lines = this.bulkText.trim().split('\n').filter(Boolean);
    const grades: BulkGradeEntry[] = lines.map((line) => {
      const [am, theory, lab] = line.split(',').map((s) => s.trim());
      return {
        registrationNumber: am,
        theoryGrade: theory ? parseFloat(theory) : undefined,
        labGrade: lab ? parseFloat(lab) : undefined,
      };
    });

    this.savingBulk = true;
    this.declarationsService.bulkGrade(this.teachingId, { grades }).subscribe({
      next: (result) => {
        this.bulkResult = result;
        this.savingBulk = false;
        this.toast.success(`Updated ${result.updated} grades.`);
        this.loadDeclarations();
      },
      error: () => (this.savingBulk = false),
    });
  }
}
