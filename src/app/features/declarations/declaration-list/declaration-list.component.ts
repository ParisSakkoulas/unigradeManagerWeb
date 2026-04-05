import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DeclarationsService } from '../declarations.service';
import { TeachingsService } from '../../teachings/teachings.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/auth/role.enum';
import {
  Declaration,
  DeclarationState,
  Teaching,
  TeachingState,
  SemesterLabel,
  Semester,
} from '../../../shared/models';
import {
  TableComponent,
  TableColumn,
} from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { GradePipe } from '../../../shared/pipes/grade.pipe';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-declaration-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    ConfirmDialogComponent,
    HasRoleDirective,
    GradePipe,
  ],
  templateUrl: './declaration-list.component.html',
  styleUrl: './declaration-list.component.scss',
})
export class DeclarationListComponent implements OnInit {
  private readonly declarationsService = inject(DeclarationsService);
  private readonly teachingsService = inject(TeachingsService);
  readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly Role = Role;
  readonly DeclarationState = DeclarationState;

  declarations: Declaration[] = [];
  availableTeachings: Teaching[] = [];
  loading = false;
  loadingTeachings = false;
  acting = false;
  declaring = false;
  showDeclareModal = false;
  selectedTeachingId = '';
  toUndeclare: Declaration | null = null;
  toFinalize: Declaration | null = null;

  get isStudent(): boolean { return this.auth.isStudent(); }

  semesterLabel(s: string): string {
    return SemesterLabel[s as Semester] ?? s;
  }

  readonly columns: TableColumn<Declaration>[] = [
    {
      key: 'course',
      label: 'Course',
      render: (row) => `${(row.teaching as any)?.course?.code} — ${(row.teaching as any)?.course?.name}`,
    },
    {
      key: 'year',
      label: 'Year / Semester',
      render: (row) => `${(row.teaching as any)?.year} · ${(row.teaching as any)?.semester}`,
    },
    {
      key: 'student',
      label: 'Student',
      render: (row) => `${(row.student as any)?.firstName} ${(row.student as any)?.lastName}`,
    },
    { key: 'state', label: 'State', render: (row) => row.state },
    {
      key: 'finalGrade',
      label: 'Final grade',
      align: 'center',
      render: (row) => row.finalGrade !== null ? row.finalGrade!.toFixed(2) : '—',
    },
  ];

  ngOnInit(): void {
    const teachingId = this.route.snapshot.queryParamMap.get('teachingId');
    const params: Record<string, any> = {};
    if (teachingId) params['teachingId'] = teachingId;
    if (this.auth.isStudent() && this.auth.profileId()) {
      params['studentId'] = this.auth.profileId();
    }
    this.load(params);
  }

  load(params: Record<string, any> = {}): void {
    this.loading = true;
    this.declarationsService.query(params).subscribe({
      next: (data) => { this.declarations = data; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  openDeclareModal(): void {
    this.showDeclareModal = true;
    this.selectedTeachingId = '';
    this.loadingTeachings = true;

    // Load teachings that are open for declaration
    this.teachingsService.query({}).subscribe({
      next: (teachings) => {
        // Only show assigned or grading_defined teachings
        const declareableStates = [
          TeachingState.ASSIGNED,
          TeachingState.GRADING_DEFINED,
          TeachingState.PARTIALLY_GRADED,
        ];
        // Exclude already declared teachings
        const declaredTeachingIds = new Set(
          this.declarations.map((d) => (d.teaching as any)?._id ?? d.teaching)
        );
        this.availableTeachings = teachings.filter(
          (t) => declareableStates.includes(t.state) && !declaredTeachingIds.has(t._id)
        );
        this.loadingTeachings = false;
      },
      error: () => this.loadingTeachings = false,
    });
  }

  onDeclare(): void {
    if (!this.selectedTeachingId) return;
    this.declaring = true;
    this.declarationsService.declare({ teachingId: this.selectedTeachingId }).subscribe({
      next: () => {
        this.toast.success('Course declared successfully.');
        this.showDeclareModal = false;
        this.selectedTeachingId = '';
        this.declaring = false;
        this.load();
      },
      error: () => this.declaring = false,
    });
  }

  confirmUndeclare(d: Declaration): void { this.toUndeclare = d; }
  confirmFinalize(d: Declaration): void { this.toFinalize = d; }

  onUndeclare(): void {
    if (!this.toUndeclare) return;
    this.acting = true;
    this.declarationsService.undeclare(this.toUndeclare._id).subscribe({
      next: () => {
        this.toast.success('Declaration removed.');
        this.declarations = this.declarations.filter((d) => d._id !== this.toUndeclare!._id);
        this.toUndeclare = null;
        this.acting = false;
      },
      error: () => this.acting = false,
    });
  }

  onFinalize(): void {
    if (!this.toFinalize) return;
    this.acting = true;
    this.declarationsService.finalizeDeclaration(this.toFinalize._id).subscribe({
      next: (updated) => {
        this.toast.success('Declaration finalized.');
        this.declarations = this.declarations.map((d) => d._id === updated._id ? updated : d);
        this.toFinalize = null;
        this.acting = false;
      },
      error: () => this.acting = false,
    });
  }

  openGradeEntry(d: Declaration): void {
    const teachingId = (d.teaching as any)?._id ?? d.teaching;
    this.router.navigate(['/declarations/teaching', teachingId, 'grade']);
  }
}

