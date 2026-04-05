import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

export type StatCardColor =
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow'
  | 'purple'
  | 'gray';

@Component({
  selector: 'app-stat-card',
  imports: [CommonModule, CardModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() sub = '';
  @Input() icon = '';
  @Input() color: StatCardColor = 'blue';
  @Input() trend: 'up' | 'down' | 'neutral' = 'neutral';

  get iconWrapClasses(): string {
    const map: Record<StatCardColor, string> = {
      blue: 'bg-blue-50',
      green: 'bg-green-50',
      red: 'bg-red-50',
      yellow: 'bg-yellow-50',
      purple: 'bg-purple-50',
      gray: 'bg-gray-100',
    };
    return map[this.color];
  }

  get subClasses(): string {
    if (this.trend === 'up') return 'text-green-600';
    if (this.trend === 'down') return 'text-red-600';
    return 'text-gray-400';
  }
}
