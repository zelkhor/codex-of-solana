import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyKeywordNameError extends AppError {
  constructor() {
    super('EMPTY_KEYWORD_NAME', 'A keyword name cannot be empty');
  }
}

export class Keyword {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Keyword, EmptyKeywordNameError> {
    if (name.trim().length === 0) return err(new EmptyKeywordNameError());
    return ok(new Keyword(name));
  }
}
