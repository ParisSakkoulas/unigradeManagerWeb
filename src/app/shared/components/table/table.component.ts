import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => string;
}

export interface SortEvent {
  key: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-table',
  imports: [CommonModule, TableModule, SkeletonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T = any> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() rows: T[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No records found.';
  @Input() hasActions = false;
  @Input() clickable = false;
  @Input() actionsTemplate: TemplateRef<any> | null = null;
  @Input() trackBy: keyof T | null = null;
  @Input() pageSize = 10;

  @Output() rowClick = new EventEmitter<T>();
  @Output() sort = new EventEmitter<SortEvent>();

  sortKey = '';
  sortDir: 'asc' | 'desc' = 'asc';

  readonly skeletonRows = Array(5).fill({});

  onSortChange(event: any): void {
    this.sortKey = event.field;
    this.sortDir = event.order === 1 ? 'asc' : 'desc';
    this.sort.emit({ key: this.sortKey, direction: this.sortDir });
  }

  alignClass(align?: 'left' | 'center' | 'right'): string {
    if (align === 'right') return 'text-right';
    if (align === 'center') return 'text-center';
    return 'text-left';
  }
}
