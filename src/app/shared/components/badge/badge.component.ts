import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'gray'
  | 'purple';

@Component({
  selector: 'app-badge',
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'gray';

  get classes(): string {
    const base =
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const variants: Record<BadgeVariant, string> = {
      success: 'bg-green-100 text-green-800',
      danger: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800',
      gray: 'bg-gray-100 text-gray-800',
      purple: 'bg-purple-100 text-purple-800',
    };
    return `${base} ${variants[this.variant]}`;
  }
}
