import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';

export class EmptyArtistNameError extends AppError {
  constructor() {
    super('EMPTY_ARTIST_NAME', 'An artist name cannot be empty');
  }
}

export class Artist {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<Artist, EmptyArtistNameError> {
    if (name.trim().length === 0) return err(new EmptyArtistNameError());
    return ok(new Artist(name));
  }
}
