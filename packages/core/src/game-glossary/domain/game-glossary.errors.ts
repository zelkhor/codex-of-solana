import { AppError } from '../../shared/helpers/errors';

export class EmptyClassNameError extends AppError {
  constructor() {
    super('EMPTY_CLASS_NAME', 'A class name cannot be empty');
  }
}

export class EmptyTalentNameError extends AppError {
  constructor() {
    super('EMPTY_TALENT_NAME', 'A talent name cannot be empty');
  }
}

export class EmptyTypeNameError extends AppError {
  constructor() {
    super('EMPTY_TYPE_NAME', 'A type name cannot be empty');
  }
}

export class EmptySubtypeNameError extends AppError {
  constructor() {
    super('EMPTY_SUBTYPE_NAME', 'A subtype name cannot be empty');
  }
}

export class EmptyKeywordNameError extends AppError {
  constructor() {
    super('EMPTY_KEYWORD_NAME', 'A keyword name cannot be empty');
  }
}

export class EmptyRarityNameError extends AppError {
  constructor() {
    super('EMPTY_RARITY_NAME', 'A rarity name cannot be empty');
  }
}

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
