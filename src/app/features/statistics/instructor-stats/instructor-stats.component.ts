import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { StatCardComponent, SpinnerComponent } from '../../../shared';
import { AuthService } from '../../../core/auth/auth.service';
import { DeclarationsService } from '../../declarations/declarations.service';

import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-instructor-stats',
  imports: [CommonModule, StatCardComponent, SpinnerComponent, ChartModule],
  templateUrl: './instructor-stats.component.html',
  styleUrl: './instructor-stats.component.scss',
})
export class InstructorStatsComponent implements OnInit {
  private readonly declarationsService = inject(DeclarationsService);
  private readonly auth = inject(AuthService);

  stats: any = null;
  loading = false;

  readonly pieOptions = {
    plugins: { legend: { position: 'bottom' } },
    responsive: true,
    maintainAspectRatio: false,
  };

  ngOnInit(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;
    this.loading = true;
    this.declarationsService.getInstructorStats(profileId).subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  buildPieData(stats: any) {
    return {
      labels: ['Passed', 'Failed', 'Pending'],
      datasets: [
        {
          data: [stats.passed, stats.failed, stats.pending],
          backgroundColor: ['#22c55e', '#ef4444', '#94a3b8'],
        },
      ],
    };
  }
}
