import { AppError } from '../../shared/helpers/errors';

export class EmptyClassNameError extends AppError {
  constructor() {
    super('EMPTY_CLASS_NAME', 'A class name cannot be empty');
  }
}
