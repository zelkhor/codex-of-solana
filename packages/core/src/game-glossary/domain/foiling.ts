import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyFoilingNameError extends AppError {
  constructor() {
    super('EMPTY_FOILING_NAME', 'A foiling name cannot be empty');
  }
}

export class UnknownFoilingError extends AppError {
  constructor(name: string) {
    super('UNKNOWN_FOILING', `Foiling "${name}" has no known game order`);
  }
}

const FOILING_ORDER = ['Regular', 'Rainbow', 'Cold', 'Gold'] as const;

export class Foiling {
  private constructor(
    public readonly name: string,
    public readonly order: number,
  ) {}

  static create(name: string): Result<Foiling, EmptyFoilingNameError | UnknownFoilingError> {
    if (name.trim().length === 0) return err(new EmptyFoilingNameError());

    const order = FOILING_ORDER.indexOf(name as (typeof FOILING_ORDER)[number]);
    if (order === -1) return err(new UnknownFoilingError(name));

    return ok(new Foiling(name, order));
  }
}
