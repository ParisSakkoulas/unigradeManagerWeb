import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeachingsService } from '../teachings.service';
import { CoursesService } from '../../courses/courses.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/auth/role.enum';
import {
  Teaching,
  TeachingState,
  TeachingStateLabel,
  Semester,
  SemesterLabel,
  Course,
} from '../../../shared/models';
import {
  TableComponent,
  TableColumn,
} from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { RoleLabelPipe } from '../../../shared/pipes/role-label.pipe';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-teaching-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    HasRoleDirective,
    RoleLabelPipe,
  ],
  templateUrl: './teaching-list.component.html',
  styleUrl: './teaching-list.component.scss',
})
export class TeachingListComponent implements OnInit {
  private readonly teachingsService = inject(TeachingsService);
  private readonly coursesService = inject(CoursesService);
  readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly Role = Role;
  readonly TeachingState = TeachingState;

  teachings: Teaching[] = [];
  courses: Course[] = [];
  loading = false;
  creating = false;
  showCreate = false;

  readonly semesters = [
    { value: Semester.FALL, label: SemesterLabel[Semester.FALL] },
    { value: Semester.SPRING, label: SemesterLabel[Semester.SPRING] },
  ];

  filterForm = this.fb.group({
    year: [''],
    semester: [''],
  });

  createForm = this.fb.group({
    courseId: ['', Validators.required],
    year: [new Date().getFullYear(), Validators.required],
    semester: ['', Validators.required],
  });

  readonly columns: TableColumn<Teaching>[] = [
    {
      key: 'course',
      label: 'Course',
      sortable: true,
      render: (row) => `${row.course?.code} — ${row.course?.name}`,
    },
    { key: 'year', label: 'Year', sortable: true, width: '80px' },
    {
      key: 'semester',
      label: 'Semester',
      width: '100px',
      render: (row) => SemesterLabel[row.semester as Semester] ?? row.semester,
    },
    {
      key: 'instructor',
      label: 'Instructor',
      render: (row) =>
        row.instructor
          ? `${row.instructor.firstName} ${row.instructor.lastName}`
          : '—',
    },
    {
      key: 'state',
      label: 'State',
      render: (row) => TeachingStateLabel[row.state as TeachingState] ?? row.state,
    },
  ];

  ngOnInit(): void {
    const courseId = this.route.snapshot.queryParamMap.get('courseId');
    const extra: Record<string, any> = {};
    if (courseId) extra['courseId'] = courseId;

    // Instructors only see their own teachings
    if (this.auth.isInstructor() && this.auth.profileId()) {
      extra['instructorId'] = this.auth.profileId();
    }

    this.load(extra);

    if (this.auth.isAdmin()) {
      this.coursesService.getAll().subscribe((data) => this.courses = data);
    }
  }

  load(extra?: Record<string, any>): void {
    this.loading = true;
    const { year, semester } = this.filterForm.value;
    const params: Record<string, any> = { ...extra };
    if (year) params['year'] = year;
    if (semester) params['semester'] = semester;

    this.teachingsService.query(params).subscribe({
      next: (data) => { this.teachings = data; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  resetFilters(): void {
    this.filterForm.reset({ year: '', semester: '' });
    this.load();
  }

  onRowClick(teaching: Teaching): void {
    this.router.navigate(['/teachings', teaching._id]);
  }

  onCreate(): void {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    this.creating = true;
    const { courseId, year, semester } = this.createForm.value;

    this.teachingsService.createTeaching({
      courseId: courseId!,
      year: year!,
      semester: semester as Semester,
    }).subscribe({
      next: () => {
        this.toast.success('Teaching created.');
        this.showCreate = false;
        this.createForm.reset({ year: new Date().getFullYear() });
        this.creating = false;
        this.load();
      },
      error: () => this.creating = false,
    });
  }
}
