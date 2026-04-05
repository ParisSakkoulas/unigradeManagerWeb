import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a grade number for display.
 *
 * Usage:
 *   {{ declaration.finalGrade | grade }}          → "7.50" or "—"
 *   {{ declaration.finalGrade | grade: true }}    → "7.50 ✓" or "3.00 ✗" or "—"
 */
@Pipe({
  name: 'grade',
  standalone: true,
})
export class GradePipe implements PipeTransform {
  transform(value: number | null | undefined, showStatus = false): string {
    if (value === null || value === undefined) return '—';

    const formatted = value.toFixed(2);

    if (!showStatus) return formatted;

    const passed = value >= 5;
    return `${formatted} ${passed ? '✓' : '✗'}`;
  }
}
