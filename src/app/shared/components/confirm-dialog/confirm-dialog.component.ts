import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonComponent } from '../button/button.component';

import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() confirmVariant: 'primary' | 'danger' = 'danger';
  @Input() loading = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
