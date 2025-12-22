import type { StringValidator } from '../types/types';

interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'email' | 'pattern';
  value?: number | RegExp;
  message?: string;
}

export class StringValidatorImpl implements StringValidator {
  private input: HTMLInputElement | HTMLTextAreaElement;
  private rules: ValidationRule[] = [];
  private errors: string[] = [];

  constructor(input: HTMLInputElement | HTMLTextAreaElement) {
    this.input = input;
  }

  public min(minLength: number, message?: string): StringValidator {
    this.rules.push({ type: 'min', value: minLength, message });
    return this;
  }

  public max(maxLength: number, message?: string): StringValidator {
    this.rules.push({ type: 'max', value: maxLength, message });
    return this;
  }

  public required(message?: string): StringValidator {
    this.rules.push({ type: 'required', message });
    return this;
  }

  public email(message?: string): StringValidator {
    this.rules.push({ type: 'email', message });
    return this;
  }

  public pattern(regex: RegExp, message?: string): StringValidator {
    this.rules.push({ type: 'pattern', value: regex, message });
    return this;
  }

  public validate(): boolean {
    this.errors = [];
    const value = this.input.value;
    const validity = this.input.validity;

    for (const rule of this.rules) {
      switch (rule.type) {
        case 'required':
          if (validity.valueMissing || value.trim() === '') {
            this.errors.push(rule.message || this.input.validationMessage || 'Поле обязательно для заполнения');
          }
          break;

        case 'min':
          if (value !== '' && (validity.tooShort || value.length < (rule.value as number))) {
            this.errors.push(rule.message || this.input.validationMessage || `Минимальная длина: ${rule.value}`);
          }
          break;

        case 'max':
          if (value !== '' && (validity.tooLong || value.length > (rule.value as number))) {
            this.errors.push(rule.message || this.input.validationMessage || `Максимальная длина: ${rule.value}`);
          }
          break;

        case 'email':
          if (value !== '' && validity.typeMismatch) {
            this.errors.push(rule.message || this.input.validationMessage || 'Неверный формат email');
          }
          break;

        case 'pattern':
          const regex = rule.value as RegExp;
          if (value !== '' && !regex.test(value)) {
            this.errors.push(rule.message || this.input.validationMessage || 'Значение не соответствует шаблону');
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
