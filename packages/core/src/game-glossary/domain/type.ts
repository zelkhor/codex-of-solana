import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyTypeNameError extends AppError {
  constructor() {
    super('EMPTY_TYPE_NAME', 'A type name cannot be empty');
  }
}

export class Type {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Type, EmptyTypeNameError> {
    if (name.trim().length === 0) return err(new EmptyTypeNameError());
    return ok(new Type(name));
  }
}
