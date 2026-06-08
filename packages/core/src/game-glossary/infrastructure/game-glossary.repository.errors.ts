import { AppError } from '../../shared/helpers/errors';

export class ClassRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'CLASS_REPOSITORY_ERROR',
      cause ? `Class repository failure: ${cause}` : 'Class repository failure',
    );
  }
}
