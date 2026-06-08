import { type Result, err, ok } from '../../shared/helpers/result';
import { EmptyClassNameError } from './game-glossary.errors';

export class Class {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Class, EmptyClassNameError> {
    if (name.trim().length === 0) return err(new EmptyClassNameError());
    return ok(new Class(name));
  }
}
