import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyClassNameError extends AppError {
  constructor() {
    super('EMPTY_CLASS_NAME', 'A class name cannot be empty');
  }
}

export class Class {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Class, EmptyClassNameError> {
    if (name.trim().length === 0) return err(new EmptyClassNameError());
    return ok(new Class(name));
  }
}
