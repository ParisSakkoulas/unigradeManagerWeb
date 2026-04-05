import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ButtonComponent,
  SpinnerComponent,
  HasRoleDirective,
  Instructor,
  InstructorRankLabel,
} from '../../../shared';
import { Role } from '../../../core/auth/role.enum';
import { InstructorsService } from '../instructors.service';

@Component({
  selector: 'app-instructor-detail',
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    SpinnerComponent,
    HasRoleDirective,
  ],
  templateUrl: './instructor-detail.component.html',
  styleUrl: './instructor-detail.component.scss',
})
export class InstructorDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly instructorsService = inject(InstructorsService);

  readonly Role = Role;
  instructor: Instructor | null = null;
  loading = false;

  get rankLabel(): string {
    return this.instructor ? InstructorRankLabel[this.instructor.rank] : '';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.instructorsService.getOne(id).subscribe({
      next: (i) => {
        this.instructor = i;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
