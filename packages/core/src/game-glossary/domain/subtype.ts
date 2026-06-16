import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptySubtypeNameError extends AppError {
  constructor() {
    super('EMPTY_SUBTYPE_NAME', 'A subtype name cannot be empty');
  }
}

export class Subtype {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Subtype, EmptySubtypeNameError> {
    if (name.trim().length === 0) return err(new EmptySubtypeNameError());
    return ok(new Subtype(name));
  }
}
