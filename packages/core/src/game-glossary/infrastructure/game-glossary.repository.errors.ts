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

export class TypeRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'TYPE_REPOSITORY_ERROR',
      cause ? `Type repository failure: ${cause}` : 'Type repository failure',
    );
  }
}

export class SubtypeRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'SUBTYPE_REPOSITORY_ERROR',
      cause ? `Subtype repository failure: ${cause}` : 'Subtype repository failure',
    );
  }
}

export class KeywordRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'KEYWORD_REPOSITORY_ERROR',
      cause ? `Keyword repository failure: ${cause}` : 'Keyword repository failure',
    );
  }
}

export class RarityRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'RARITY_REPOSITORY_ERROR',
      cause ? `Rarity repository failure: ${cause}` : 'Rarity repository failure',
    );
  }
}

export class FoilingRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'FOILING_REPOSITORY_ERROR',
      cause ? `Foiling repository failure: ${cause}` : 'Foiling repository failure',
    );
  }
}
