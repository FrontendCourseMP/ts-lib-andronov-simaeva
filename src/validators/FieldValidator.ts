import type { FieldValidator as IFieldValidator, StringValidator, NumberValidator, ArrayValidator } from '../types/types';
import { StringValidatorImpl } from './StringValidator';
import { NumberValidatorImpl } from './NumberValidator';
import { ArrayValidatorImpl } from './ArrayValidator';

export class FieldValidator implements IFieldValidator {
  private input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  private fieldName: string;
  private currentValidator: StringValidator | NumberValidator | ArrayValidator | null = null;

  constructor(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, fieldName: string) {
    this.input = input;
    this.fieldName = fieldName;
  }

  public string(): StringValidator {
    if (!(this.input instanceof HTMLInputElement || this.input instanceof HTMLTextAreaElement)) {
      throw new Error(`Поле "${this.fieldName}" не является текстовым полем`);
    }
    const validator = new StringValidatorImpl(this.input);
    this.currentValidator = validator;
    return validator;
  }

  public number(): NumberValidator {
    if (!(this.input instanceof HTMLInputElement)) {
      throw new Error(`Поле "${this.fieldName}" не является полем ввода`);
    }
    const validator = new NumberValidatorImpl(this.input);
    this.currentValidator = validator;
    return validator;
  }

  public array(): ArrayValidator {
    if (!(this.input instanceof HTMLSelectElement || this.input instanceof HTMLInputElement)) {
      throw new Error(`Поле "${this.fieldName}" не поддерживает массивы`);
    }
    const validator = new ArrayValidatorImpl(this.input, this.fieldName);
    this.currentValidator = validator;
    return validator;
  }

  public validate(): boolean {
    if (!this.currentValidator) {
      return true;
    }
    return this.currentValidator.validate();
  }

  public getErrors(): string[] {
    if (!this.currentValidator) {
      return [];
    }
    return this.currentValidator.getErrors();
  }
}
