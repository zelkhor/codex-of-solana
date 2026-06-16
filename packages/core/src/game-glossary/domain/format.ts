import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyFormatNameError extends AppError {
  constructor() {
    super('EMPTY_FORMAT_NAME', 'A format name cannot be empty');
  }
}

export class Format {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Format, EmptyFormatNameError> {
    if (name.trim().length === 0) return err(new EmptyFormatNameError());
    return ok(new Format(name));
  }
}
