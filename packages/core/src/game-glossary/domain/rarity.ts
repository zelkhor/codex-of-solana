import { type Result, err, ok } from '../../shared/helpers/result';
import { EmptyRarityNameError } from './game-glossary.errors';

export class Rarity {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Rarity, EmptyRarityNameError> {
    if (name.trim().length === 0) return err(new EmptyRarityNameError());
    return ok(new Rarity(name));
  }
}
