import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonModule } from 'primeng/button';

import { SpinnerComponent } from '../spinner/spinner.component';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [ButtonModule, CommonModule, SpinnerComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;

  @Output() onClick = new EventEmitter<MouseEvent>();

  get classes(): string {
    const base =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary:
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return [
      base,
      variants[this.variant],
      sizes[this.size],
      this.fullWidth ? 'w-full' : '',
    ].join(' ');
  }
}
