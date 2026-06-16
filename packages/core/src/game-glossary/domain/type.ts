import { type Result, err, ok } from '../../shared/helpers/result';
import { EmptyTypeNameError } from './game-glossary.errors';

export class Type {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Type, EmptyTypeNameError> {
    if (name.trim().length === 0) return err(new EmptyTypeNameError());
    return ok(new Type(name));
  }
}
