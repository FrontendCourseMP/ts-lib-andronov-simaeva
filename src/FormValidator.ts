class FormValidator {
  private form: HTMLFormElement;
  private fields: Map<string, HTMLInputElement | HTMLTextAreaElement>;
  private validators: Map<string, FieldValidator>;

  constructor(formElement: HTMLFormElement) {
    this.form = formElement;
    this.fields = new Map();
    this.validators = new Map();

    this.collectFields();
    this.validateLabels();
    this.validateErrorContainers();
  }

  private collectFields(): void {
    const inputs = this.form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      const name = input.getAttribute('name');
      if (name) {
        this.fields.set(name, input);
      }
    });
  }

  private validateLabels(): void {
    this.fields.forEach((input, name) => {
      const id = input.id;
      let label = null;

      if (id) {
        label = this.form.querySelector(`label[for="${id}"]`);
      }

      if (!label) {
        label = input.closest('label');
      }

      if (!label) {
        console.warn(`Поле "${name}" не имеет связанного label`);
      }
    });
  }

  private validateErrorContainers(): void {
    this.fields.forEach((input, name) => {
      const errorContainer = this.form.querySelector(`[data-error="${name}"]`);

      if (!errorContainer) {
        console.warn(`Для поля "${name}" не найден контейнер ошибок [data-error="${name}"]`);
      }
    });
  }

  public field(fieldName: string): FieldValidator {
    const input = this.fields.get(fieldName);

    if (!input) {
      throw new Error(`Поле "${fieldName}" не найдено в форме`);
    }

    const validator = new FieldValidator(input, fieldName);
    this.validators.set(fieldName, validator);

    return validator;
  }

  public validate(): boolean {
    let isValid = true;

    this.clearErrors();

    this.validators.forEach((validator, fieldName) => {
      const fieldValid = validator.validate();
      if (!fieldValid) {
        isValid = false;
        this.showErrors(fieldName, validator.getErrors());
      }
    });

    return isValid;
  }

  private clearErrors(): void {
    this.form.querySelectorAll('[data-error]').forEach(container => {
      container.textContent = '';
    });
  }

  private showErrors(fieldName: string, errors: string[]): void {
    const errorContainer = this.form.querySelector(`[data-error="${fieldName}"]`);
    if (errorContainer) {
      errorContainer.textContent = errors.join(', ');
    }
  }
}