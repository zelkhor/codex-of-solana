import { type Result, err, ok } from '../../shared/helpers/result';
import { EmptySubtypeNameError } from './game-glossary.errors';

export class Subtype {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Subtype, EmptySubtypeNameError> {
    if (name.trim().length === 0) return err(new EmptySubtypeNameError());
    return ok(new Subtype(name));
  }
}
