import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'search';
@Component({
  selector: 'app-input',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  @Input() inputId = `input-${Math.random().toString(36).slice(2)}`;
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;

  value = '';
  isDisabled = false;

  onChange: (val: string) => void = () => {};
  onTouched: () => void = () => {};

  get inputClasses(): string {
    const base =
      'w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2';
    const normal = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    const errored = 'border-red-400 focus:border-red-500 focus:ring-red-500';
    const disabled = 'bg-gray-50 cursor-not-allowed opacity-60';
    return [
      base,
      this.error ? errored : normal,
      this.isDisabled ? disabled : '',
    ].join(' ');
  }

  writeValue(val: string): void {
    this.value = val ?? '';
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }
}
