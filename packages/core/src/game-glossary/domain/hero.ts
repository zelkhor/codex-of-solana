import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyHeroNameError extends AppError {
  constructor() {
    super('EMPTY_HERO_NAME', 'A hero name cannot be empty');
  }
}

export class HeroNotFoundError extends AppError {
  constructor(name: string) {
    super('HERO_NOT_FOUND', `Hero "${name}" was not found`);
  }
}

export class NotAYoungHeroError extends AppError {
  constructor(name: string) {
    super('NOT_A_YOUNG_HERO', `Hero "${name}" is not a young hero`);
  }
}

export class NotAnAdultHeroError extends AppError {
  constructor(name: string) {
    super('NOT_AN_ADULT_HERO', `Hero "${name}" is not an adult hero`);
  }
}

export class HeroAlreadyHasAdultFormError extends AppError {
  constructor(name: string) {
    super('HERO_ALREADY_HAS_ADULT_FORM', `Hero "${name}" already has an adult form`);
  }
}

export class HeroAlreadyHasYoungFormError extends AppError {
  constructor(name: string) {
    super('HERO_ALREADY_HAS_YOUNG_FORM', `Hero "${name}" already has a young form`);
  }
}

export type HeroProps = {
  name: string;
  isYoung: boolean;
  counterpart: string | null;
};

export class Hero {
  private constructor(
    public readonly name: string,
    public readonly isYoung: boolean,
    public readonly counterpart: string | null,
  ) {}

  static create(props: {
    name: string;
    isYoung: boolean;
    counterpart?: string | null;
  }): Result<Hero, EmptyHeroNameError> {
    if (props.name.trim().length === 0) return err(new EmptyHeroNameError());
    return ok(new Hero(props.name, props.isYoung, props.counterpart ?? null));
  }
}
