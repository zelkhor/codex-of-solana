import { type Result, err, ok } from '../../shared/helpers/result';
import { EmptyTalentNameError } from './game-glossary.errors';

export class Talent {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Talent, EmptyTalentNameError> {
    if (name.trim().length === 0) return err(new EmptyTalentNameError());
    return ok(new Talent(name));
  }
}
