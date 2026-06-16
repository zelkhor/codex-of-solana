import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyEditionNameError extends AppError {
  constructor() {
    super('EMPTY_EDITION_NAME', 'An edition name cannot be empty');
  }
}

export class Edition {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Edition, EmptyEditionNameError> {
    if (name.trim().length === 0) return err(new EmptyEditionNameError());
    return ok(new Edition(name));
  }
}
