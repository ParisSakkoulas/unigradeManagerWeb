import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: ModalSize = 'md';
  @Input() showClose = true;
  @Input() closeOnBackdrop = true;
  @Input() hasFooter = false;

  @Output() closed = new EventEmitter<void>();

  get panelClasses(): string {
    const sizes: Record<ModalSize, string> = {
      sm: 'w-full max-w-sm',
      md: 'w-full max-w-lg',
      lg: 'w-full max-w-2xl',
      xl: 'w-full max-w-4xl',
    };
    return sizes[this.size];
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) this.closed.emit();
  }
}
