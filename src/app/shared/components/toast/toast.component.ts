import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  toastClasses(type: ToastType): string {
    const map: Record<ToastType, string> = {
      success: 'bg-green-50 text-green-800 border border-green-200',
      error: 'bg-red-50 text-red-800 border border-red-200',
      warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
      info: 'bg-blue-50 text-blue-800 border border-blue-200',
    };
    return map[type];
  }
}
