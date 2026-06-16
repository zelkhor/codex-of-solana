import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyTreatmentNameError extends AppError {
  constructor() {
    super('EMPTY_TREATMENT_NAME', 'A treatment name cannot be empty');
  }
}

export class Treatment {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Treatment, EmptyTreatmentNameError> {
    if (name.trim().length === 0) return err(new EmptyTreatmentNameError());
    return ok(new Treatment(name));
  }
}
