import './style.css';
import { FormValidator } from './FormValidator';

// Инициализация валидатора формы
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector<HTMLFormElement>('#registration-form');
  
  if (!form) {
    console.error('Форма не найдена');
    return;
  }

  // Создаём экземпляр валидатора
  const validator = new FormValidator(form);

  // Настраиваем валидацию для каждого поля
  validator.field('username')
    .string()
    .required('Имя пользователя обязательно')
    .min(3, 'Имя должно содержать минимум 3 символа')
    .max(20, 'Имя должно содержать максимум 20 символов')
    .pattern(/^[A-Za-z0-9_]+$/, 'Только буквы, цифры и подчёркивания');

  validator.field('email')
    .string()
    .required('Email обязателен')
    .email('Введите корректный email');

  validator.field('age')
    .number()
    .required('Возраст обязателен')
    .min(18, 'Вам должно быть минимум 18 лет')
    .max(120, 'Введите корректный возраст');

  validator.field('phone')
    .string()
    .required('Телефон обязателен')
    .pattern(/^\+?\d{10,15}$/, 'Введите корректный телефон (10-15 цифр)');

  validator.field('interests')
    .array()
    .min(1, 'Выберите хотя бы один интерес')
    .max(3, 'Можно выбрать максимум 3 интереса');

  validator.field('subscribe')
    .array()
    .required('Выберите хотя бы одну опцию подписки');

  // Обработка отправки формы
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const isValid = validator.validate();

    if (isValid) {
      console.log('✅ Форма валидна! Отправка данных...');
      alert('Форма успешно отправлена!');
      form.reset();
    } else {
      console.log('❌ Форма содержит ошибки');
    }
  });

  // Валидация в реальном времени (опционально)
  form.addEventListener('blur', () => {
    validator.validate();
  }, true);
});
