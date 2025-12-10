import type { FieldValidator as IFieldValidator } from '../types/types';


export class FieldValidator implements IFieldValidator {
  private input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  private fieldName: string;

  constructor(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, fieldName: string) {
    this.input = input;
    this.fieldName = fieldName;
  }

  public string() {
    return {} as any;
  }

  public number() {
    return {} as any;
  }

  public array() {
    return {} as any;
  }
}
