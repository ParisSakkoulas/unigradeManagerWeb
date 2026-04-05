import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeclarationsService } from '../../declarations/declarations.service';
import { AuthService } from '../../../core/auth/auth.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-student-stats',
  imports: [CommonModule, StatCardComponent, SpinnerComponent, ChartModule],
  templateUrl: './student-stats.component.html',
  styleUrl: './student-stats.component.scss',
})
export class StudentStatsComponent implements OnInit {
  private readonly declarationsService = inject(DeclarationsService);
  private readonly auth = inject(AuthService);

  stats: any = null;
  loading = false;

  readonly pieOptions = {
    plugins: { legend: { position: 'bottom' } },
    responsive: true,
    maintainAspectRatio: false,
  };

  get totalRate(): string {
    if (!this.stats) return '—';
    const total = this.stats.totalPassed + this.stats.totalFailed;
    if (!total) return '0%';
    return ((this.stats.totalPassed / total) * 100).toFixed(1) + '%';
  }

  get pieData() {
    return {
      labels: ['Passed', 'Failed'],
      datasets: [
        {
          data: [this.stats?.totalPassed ?? 0, this.stats?.totalFailed ?? 0],
          backgroundColor: ['#22c55e', '#ef4444'],
        },
      ],
    };
  }

  ngOnInit(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;
    this.loading = true;
    this.declarationsService.getStudentStats(profileId).subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
