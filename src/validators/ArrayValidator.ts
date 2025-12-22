import type { ArrayValidator } from '../types/types';

interface ValidationRule {
  type: 'required' | 'min' | 'max';
  value?: number;
  message?: string;
}

export class ArrayValidatorImpl implements ArrayValidator {
  private input: HTMLSelectElement | HTMLInputElement;
  private fieldName: string;
  private rules: ValidationRule[] = [];
  private errors: string[] = [];

  constructor(input: HTMLSelectElement | HTMLInputElement, fieldName: string) {
    this.input = input;
    this.fieldName = fieldName;
  }

  public min(minItems: number, message?: string): ArrayValidator {
    this.rules.push({ type: 'min', value: minItems, message });
    return this;
  }

  public max(maxItems: number, message?: string): ArrayValidator {
    this.rules.push({ type: 'max', value: maxItems, message });
    return this;
  }

  public required(message?: string): ArrayValidator {
    this.rules.push({ type: 'required', message });
    return this;
  }

  public validate(): boolean {
    this.errors = [];
    const selectedCount = this.getSelectedCount();

    for (const rule of this.rules) {
      switch (rule.type) {
        case 'required':
          if (selectedCount === 0) {
            this.errors.push(rule.message || 'Необходимо выбрать хотя бы один элемент');
          }
          break;

        case 'min':
          if (selectedCount < (rule.value as number)) {
            this.errors.push(rule.message || `Минимальное количество элементов: ${rule.value}`);
          }
          break;

        case 'max':
          if (selectedCount > (rule.value as number)) {
            this.errors.push(rule.message || `Максимальное количество элементов: ${rule.value}`);
          }
          break;
      }
    }

    return this.errors.length === 0;
  }

  public getErrors(): string[] {
    return this.errors;
  }

  private getSelectedCount(): number {
    if (this.input instanceof HTMLSelectElement && this.input.multiple) {
      return Array.from(this.input.selectedOptions).length;
    }

    if (this.input.type === 'checkbox') {
      const form = this.input.form;
      if (!form) return this.input.checked ? 1 : 0;

      const checkboxes = form.querySelectorAll<HTMLInputElement>(
        `input[type="checkbox"][name="${this.fieldName}"]`
      );
      return Array.from(checkboxes).filter(cb => cb.checked).length;
    }

    return 0;
  }
}
