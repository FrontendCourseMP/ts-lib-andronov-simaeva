import { describe, test, expect, beforeEach } from 'vitest';
import { StringValidatorImpl } from '../validators/StringValidator';
import { JSDOM } from 'jsdom';

describe('StringValidator', () => {
  let dom: JSDOM;
  let input: HTMLInputElement;

  beforeEach(() => {
    // Arrange - создаём чистый DOM для каждого теста
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document as unknown as Document;
    
    input = document.createElement('input');
    input.type = 'text';
    input.name = 'username';
  });

  // ==================== HAPPY PATH ====================
  describe('Happy Path - валидные данные', () => {
    test('должен вернуть true для валидной строки без правил', () => {
      // Arrange
      input.value = 'John Doe';
      const validator = new StringValidatorImpl(input);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен вернуть true когда строка длиннее минимума', () => {
      // Arrange
      input.value = 'JohnDoe';
      const validator = new StringValidatorImpl(input);
      validator.min(3);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен вернуть true когда строка короче максимума', () => {
      // Arrange
      input.value = 'John';
      const validator = new StringValidatorImpl(input);
      validator.max(10);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен вернуть true когда строка в диапазоне min-max', () => {
      // Arrange
      input.value = 'JohnDoe';
      const validator = new StringValidatorImpl(input);
      validator.min(3).max(20);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен вернуть true для валидного email', () => {
      // Arrange
      input.type = 'email';
      input.value = 'test@example.com';
      const validator = new StringValidatorImpl(input);
      validator.email();

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен вернуть true когда строка соответствует pattern', () => {
      // Arrange
      input.value = '12345';
      const validator = new StringValidatorImpl(input);
      validator.pattern(/^\d+$/, 'Только цифры');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен вернуть true когда required поле заполнено', () => {
      // Arrange
      input.value = 'John';
      input.required = true;
      const validator = new StringValidatorImpl(input);
      validator.required();

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });
  });

  // ==================== ЗЛЫЕ ТЕСТЫ ====================
  describe('Злые тесты - невалидные данные', () => {
    test('должен вернуть false когда required поле пустое', () => {
      // Arrange
      input.value = '';
      input.required = true;
      const validator = new StringValidatorImpl(input);
      validator.required('Имя обязательно!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Имя обязательно!');
    });

    test('должен вернуть false когда строка короче минимума', () => {
      // Arrange
      input.value = 'ab';
      const validator = new StringValidatorImpl(input);
      validator.min(3, 'Минимум 3 символа!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Минимум 3 символа!');
    });

    test('должен вернуть false когда строка длиннее максимума', () => {
      // Arrange
      input.value = 'Very Long Username That Exceeds Limit';
      const validator = new StringValidatorImpl(input);
      validator.max(10, 'Максимум 10 символов!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Максимум 10 символов!');
    });

    test('должен вернуть false для невалидного email', () => {
      // Arrange
      input.type = 'email';
      input.value = 'invalid-email';
      const validator = new StringValidatorImpl(input);
      validator.email('Неверный формат email!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Неверный формат email!');
    });

    test('должен вернуть false когда строка не соответствует pattern', () => {
      // Arrange
      input.value = 'abc123';
      const validator = new StringValidatorImpl(input);
      validator.pattern(/^\d+$/, 'Только цифры!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Только цифры!');
    });

    test('должен собрать несколько ошибок', () => {
      // Arrange
      input.value = '';
      input.required = true;
      const validator = new StringValidatorImpl(input);
      validator.required('Обязательно!').min(3, 'Минимум 3!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toHaveLength(1);
      expect(validator.getErrors()).toContain('Обязательно!');
    });
  });

  // ==================== ГРАНИЧНЫЕ ЗНАЧЕНИЯ ====================
  describe('Тесты граничных значений', () => {
    test('должен принять минимальное граничное значение (равно min)', () => {
      // Arrange
      input.value = 'abc';
      const validator = new StringValidatorImpl(input);
      validator.min(3);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
    });

    test('должен принять максимальное граничное значение (равно max)', () => {
      // Arrange
      input.value = 'abcdefghij';
      const validator = new StringValidatorImpl(input);
      validator.max(10);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
    });

    test('должен отклонить значение на 1 символ короче минимума', () => {
      // Arrange
      input.value = 'ab';
      const validator = new StringValidatorImpl(input);
      validator.min(3);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
    });

    test('должен отклонить значение на 1 символ длиннее максимума', () => {
      // Arrange
      input.value = 'abcdefghijk';
      const validator = new StringValidatorImpl(input);
      validator.max(10);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
    });
  });

  // ==================== ПРОВЕРКА ВСЕХ ВЕТОК ====================
  describe('Branch Coverage - проверка всех условий', () => {
    test('пустое поле без правил - валидно', () => {
      // Arrange
      input.value = '';
      const validator = new StringValidatorImpl(input);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
    });

    test('пустое поле с min/max (не required) - валидно', () => {
      // Arrange
      input.value = '';
      const validator = new StringValidatorImpl(input);
      validator.min(3).max(10);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
    });

    test('строка из пробелов в required поле - невалидно', () => {
      // Arrange
      input.value = '   ';
      input.required = true;
      const validator = new StringValidatorImpl(input);
      validator.required('Пустое поле!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Пустое поле!');
    });

    test('цепочка валидаторов - fluent API', () => {
      // Arrange
      input.value = 'JohnDoe';
      const validator = new StringValidatorImpl(input);
      
      // Act
      const result = validator
        .required('Обязательно!')
        .min(3, 'Минимум 3!')
        .max(20, 'Максимум 20!')
        .pattern(/^[A-Za-z]+$/, 'Только буквы!')
        .validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });
  });
});
