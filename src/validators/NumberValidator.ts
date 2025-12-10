import type { NumberValidator } from '../types/types';

interface ValidationRule {
  type: 'required' | 'min' | 'max';
  value?: number;
  message?: string;
}

export class NumberValidatorImpl implements NumberValidator {
  private input: HTMLInputElement;
  private rules: ValidationRule[] = [];
  private errors: string[] = [];

  constructor(input: HTMLInputElement) {
    this.input = input;
  }

  public min(minValue: number, message?: string): NumberValidator {
    this.rules.push({ type: 'min', value: minValue, message });
    return this;
  }

  public max(maxValue: number, message?: string): NumberValidator {
    this.rules.push({ type: 'max', value: maxValue, message });
    return this;
  }

  public required(message?: string): NumberValidator {
    this.rules.push({ type: 'required', message });
    return this;
  }

  public validate(): boolean {
    this.errors = [];
    const value = this.input.value.trim();
    const validity = this.input.validity;

    for (const rule of this.rules) {
      switch (rule.type) {
        case 'required':
          if (validity.valueMissing || value === '') {
            this.errors.push(rule.message || this.input.validationMessage || 'Поле обязательно для заполнения');
          }
          break;

        case 'min':
          if (value !== '' && (validity.rangeUnderflow || Number(value) < (rule.value as number))) {
            this.errors.push(rule.message || this.input.validationMessage || `Минимальное значение: ${rule.value}`);
          }
          break;

        case 'max':
          if (value !== '' && (validity.rangeOverflow || Number(value) > (rule.value as number))) {
            this.errors.push(rule.message || this.input.validationMessage || `Максимальное значение: ${rule.value}`);
          }
          break;
      }
    }

    return this.errors.length === 0;
  }

  public getErrors(): string[] {
    return this.errors;
  }
}
