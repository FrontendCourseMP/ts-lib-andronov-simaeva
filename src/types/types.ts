export type sum = (a: number, b: number) => number

export interface StringValidator {
  min(minLength: number, message?: string): StringValidator;
  max(maxLength: number, message?: string): StringValidator;
  required(message?: string): StringValidator;
  email(message?: string): StringValidator;
  pattern(regex: RegExp, message?: string): StringValidator;
}

export interface NumberValidator {
  min(minValue: number, message?: string): NumberValidator;
  max(maxValue: number, message?: string): NumberValidator;
  required(message?: string): NumberValidator;
}

export interface ArrayValidator {
  min(minItems: number, message?: string): ArrayValidator;
  max(maxItems: number, message?: string): ArrayValidator;
  required(message?: string): ArrayValidator;
}

export interface FieldValidator {
  string(): StringValidator;
  number(): NumberValidator;
  array(): ArrayValidator;
}

export interface FormValidator {
  field(fieldName: string): FieldValidator;
  validate(): boolean;
}

export type FormFactoryFunction = (formElement: HTMLFormElement) => FormValidator;