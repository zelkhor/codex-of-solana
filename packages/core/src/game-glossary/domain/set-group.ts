import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyGroupNameError extends AppError {
  constructor() {
    super('EMPTY_GROUP_NAME', 'A group name cannot be empty');
  }
}

export class GroupAlreadyExistsError extends AppError {
  constructor(name: string) {
    super('GROUP_ALREADY_EXISTS', `A group named "${name}" already exists`);
  }
}

export class SetGroup {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<SetGroup, EmptyGroupNameError> {
    const trimmed = name.trim();
    if (trimmed.length === 0) return err(new EmptyGroupNameError());
    return ok(new SetGroup(trimmed));
  }
}
