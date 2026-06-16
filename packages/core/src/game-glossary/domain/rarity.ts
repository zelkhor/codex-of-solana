import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyRarityNameError extends AppError {
  constructor() {
    super('EMPTY_RARITY_NAME', 'A rarity name cannot be empty');
  }
}

export class Rarity {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Rarity, EmptyRarityNameError> {
    if (name.trim().length === 0) return err(new EmptyRarityNameError());
    return ok(new Rarity(name));
  }
}
