export type sum = (a: number, b: number) => number

export interface ValidationMessages {
  valueMissing?: string;      // для required
  typeMismatch?: string;      // для type="email", type="url"
  patternMismatch?: string;   // для pattern
  tooLong?: string;           // для maxlength
  tooShort?: string;          // для minlength
  rangeUnderflow?: string;    // для min (числа)
  rangeOverflow?: string;     // для max (числа)
  stepMismatch?: string;      // для step
  badInput?: string;          // для невалидного ввода
  customError?: string;       // для setCustomValidity()
}

export interface StringValidator {
  min(minLength: number, message?: string): StringValidator;
  max(maxLength: number, message?: string): StringValidator;
  required(message?: string): StringValidator;
  email(message?: string): StringValidator;
  pattern(regex: RegExp, message?: string): StringValidator;
  validate(): boolean;
  getErrors(): string[];
}

export interface NumberValidator {
  min(minValue: number, message?: string): NumberValidator;
  max(maxValue: number, message?: string): NumberValidator;
  required(message?: string): NumberValidator;
  validate(): boolean;
  getErrors(): string[];
}

export interface ArrayValidator {
  min(minItems: number, message?: string): ArrayValidator;
  max(maxItems: number, message?: string): ArrayValidator;
  required(message?: string): ArrayValidator;
  validate(): boolean;
  getErrors(): string[];
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