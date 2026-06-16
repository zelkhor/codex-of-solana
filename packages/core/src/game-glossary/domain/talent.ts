import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyTalentNameError extends AppError {
  constructor() {
    super('EMPTY_TALENT_NAME', 'A talent name cannot be empty');
  }
}

export class Talent {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Talent, EmptyTalentNameError> {
    if (name.trim().length === 0) return err(new EmptyTalentNameError());
    return ok(new Talent(name));
  }
}
