import { type Result, err, ok } from '../../shared/helpers/result';
import { EmptyKeywordNameError } from './game-glossary.errors';

export class Keyword {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Keyword, EmptyKeywordNameError> {
    if (name.trim().length === 0) return err(new EmptyKeywordNameError());
    return ok(new Keyword(name));
  }
}
