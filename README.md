# Документация по вашему решению

## Тестирование

Проект использует **Vitest** для тестирования с **jsdom** для симуляции DOM в Node.js окружении.

### Запуск тестов

```bash
npm test
```

### Архитектура тестов

Тесты написаны с использованием паттерна **AAA (Arrange, Act, Assert)** и включают:

- **Happy path тесты** - проверка корректного поведения
- **Злые тесты (evil tests)** - проверка edge cases и негативных сценариев
- **Проверка всех веток** - coverage для всех if/else условий
- **Branch coverage** - тестирование всех возможных путей выполнения

### Структура тестов

```
src/tests/
├── sum.test.js              # Тесты функции sum
├── FormValidator.test.ts    # Тесты FormValidator класса
├── FieldValidator.test.ts   # Тесты FieldValidator класса
├── StringValidator.test.ts  # Интерфейсные тесты StringValidator
├── NumberValidator.test.ts  # Интерфейсные тесты NumberValidator
└── ArrayValidator.test.ts   # Интерфейсные тесты ArrayValidator
```

### Особенности тестирования

- **jsdom** используется для тестирования DOM манипуляций
- Моки используются для изоляции зависимостей
- Тесты проверяют приватные методы через type casting
- Интеграционные тесты для полного workflow валидации