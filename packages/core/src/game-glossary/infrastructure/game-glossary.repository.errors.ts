import { AppError } from '../../shared/helpers/errors';

export class ClassRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'CLASS_REPOSITORY_ERROR',
      cause ? `Class repository failure: ${cause}` : 'Class repository failure',
    );
  }
}

export class TalentRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'TALENT_REPOSITORY_ERROR',
      cause ? `Talent repository failure: ${cause}` : 'Talent repository failure',
    );
  }
}
