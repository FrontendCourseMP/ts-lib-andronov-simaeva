import { describe, test, expect, beforeEach } from 'vitest';
import { NumberValidatorImpl } from '../validators/NumberValidator';
import { JSDOM } from 'jsdom';

describe('NumberValidator', () => {
  let dom: JSDOM;
  let input: HTMLInputElement;

  beforeEach(() => {
    // Arrange - создаём чистый DOM для каждого теста
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document as unknown as Document;
    
    input = document.createElement('input');
    input.type = 'number';
    input.name = 'age';
  });

  // ==================== HAPPY PATH ====================
  describe('Happy Path - валидные данные', () => {
    test('должен вернуть true для валидного числа без правил', () => {
      // Arrange
      input.value = '25';
      const validator = new NumberValidatorImpl(input);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен вернуть true когда число больше минимума', () => {
      // Arrange
      input.value = '25';
      const validator = new NumberValidatorImpl(input);
      validator.min(18);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен вернуть true когда число меньше максимума', () => {
      // Arrange
      input.value = '50';
      const validator = new NumberValidatorImpl(input);
      validator.max(100);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен вернуть true когда число в диапазоне min-max', () => {
      // Arrange
      input.value = '25';
      const validator = new NumberValidatorImpl(input);
      validator.min(18).max(65);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен вернуть true когда обязательное поле заполнено', () => {
      // Arrange
      input.value = '42';
      input.required = true;
      const validator = new NumberValidatorImpl(input);
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
      const validator = new NumberValidatorImpl(input);
      validator.required('Возраст обязателен!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Возраст обязателен!');
    });

    test('должен вернуть false когда число меньше минимума', () => {
      // Arrange
      input.value = '15';
      const validator = new NumberValidatorImpl(input);
      validator.min(18, 'Минимум 18 лет!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Минимум 18 лет!');
    });

    test('должен вернуть false когда число больше максимума', () => {
      // Arrange
      input.value = '150';
      const validator = new NumberValidatorImpl(input);
      validator.max(120, 'Максимум 120 лет!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Максимум 120 лет!');
    });

    test('должен вернуть false когда число не в диапазоне', () => {
      // Arrange
      input.value = '200';
      const validator = new NumberValidatorImpl(input);
      validator.min(18, 'Минимум 18!').max(100, 'Максимум 100!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toHaveLength(1);
      expect(validator.getErrors()[0]).toContain('Максимум 100!');
    });

    test('должен собрать несколько ошибок', () => {
      // Arrange
      input.value = '';
      input.required = true;
      const validator = new NumberValidatorImpl(input);
      validator.required('Обязательно!').min(18, 'Минимум 18!');

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
      input.value = '18';
      const validator = new NumberValidatorImpl(input);
      validator.min(18);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
    });

    test('должен принять максимальное граничное значение (равно max)', () => {
      // Arrange
      input.value = '100';
      const validator = new NumberValidatorImpl(input);
      validator.max(100);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
    });

    test('должен отклонить значение на 1 меньше минимума', () => {
      // Arrange
      input.value = '17';
      const validator = new NumberValidatorImpl(input);
      validator.min(18, 'Меньше минимума!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Меньше минимума!');
    });

    test('должен отклонить значение на 1 больше максимума', () => {
      // Arrange
      input.value = '101';
      const validator = new NumberValidatorImpl(input);
      validator.max(100, 'Больше максимума!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Больше максимума!');
    });

    test('должен работать с нулём', () => {
      // Arrange
      input.value = '0';
      const validator = new NumberValidatorImpl(input);
      validator.min(0).max(100);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
    });

    test('должен работать с отрицательными числами', () => {
      // Arrange
      input.value = '-5';
      const validator = new NumberValidatorImpl(input);
      validator.min(-10).max(10);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
    });

    test('должен работать с дробными числами', () => {
      // Arrange
      input.value = '18.5';
      const validator = new NumberValidatorImpl(input);
      validator.min(18).max(100);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
    });
  });

  // ==================== EDGE CASES ====================
  describe('Edge cases - особые случаи', () => {
    test('должен игнорировать min/max для пустого НЕ обязательного поля', () => {
      // Arrange
      input.value = '';
      const validator = new NumberValidatorImpl(input);
      validator.min(18).max(100);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен использовать дефолтное сообщение если не указано кастомное', () => {
      // Arrange
      input.value = '10';
      const validator = new NumberValidatorImpl(input);
      validator.min(18);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()[0]).toContain('18');
    });

    test('должен очищать ошибки при повторной валидации', () => {
      // Arrange
      input.value = '10';
      const validator = new NumberValidatorImpl(input);
      validator.min(18, 'Ошибка!');

      // Act
      validator.validate();
      input.value = '25';
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });

    test('должен поддерживать цепочку вызовов (method chaining)', () => {
      // Arrange
      input.value = '25';
      const validator = new NumberValidatorImpl(input);

      // Act
      const result = validator
        .required('Обязательно!')
        .min(18, 'Минимум 18!')
        .max(100, 'Максимум 100!')
        .validate();

      // Assert
      expect(result).toBe(true);
    });
  });

  // ==================== ПРОВЕРКА ВСЕХ ВЕТОК IF/ELSE ====================
  describe('Покрытие всех веток кода', () => {
    test('ветка required: valueMissing = true', () => {
      // Arrange
      input.value = '';
      input.required = true;
      const validator = new NumberValidatorImpl(input);
      validator.required('Пусто!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('Пусто!');
    });

    test('ветка required: value пустая строка', () => {
      // Arrange
      input.value = '   '; // пробелы
      const validator = new NumberValidatorImpl(input);
      validator.required('Только пробелы!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
    });

    test('ветка min: rangeUnderflow = true', () => {
      // Arrange
      input.value = '10';
      input.min = '18';
      const validator = new NumberValidatorImpl(input);
      validator.min(18, 'Меньше!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
    });

    test('ветка min: Number(value) < minValue', () => {
      // Arrange
      input.value = '15';
      const validator = new NumberValidatorImpl(input);
      validator.min(18, 'JS проверка меньше!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('JS проверка меньше!');
    });

    test('ветка max: rangeOverflow = true', () => {
      // Arrange
      input.value = '150';
      input.max = '100';
      const validator = new NumberValidatorImpl(input);
      validator.max(100, 'Больше!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
    });

    test('ветка max: Number(value) > maxValue', () => {
      // Arrange
      input.value = '120';
      const validator = new NumberValidatorImpl(input);
      validator.max(100, 'JS проверка больше!');

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false);
      expect(validator.getErrors()).toContain('JS проверка больше!');
    });

    test('ветка: пустое значение не проверяется на min/max', () => {
      // Arrange
      input.value = '';
      const validator = new NumberValidatorImpl(input);
      validator.min(18).max(100);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true); // не должно быть ошибок
    });

    test('ветка: нет правил валидации', () => {
      // Arrange
      input.value = '42';
      const validator = new NumberValidatorImpl(input);

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(true);
      expect(validator.getErrors()).toHaveLength(0);
    });
  });
});
