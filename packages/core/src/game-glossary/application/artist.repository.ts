import type { Result } from '../../shared/helpers/result';
import type { Artist } from '../domain/artist';

export interface IArtistRepository {
  findAll(): Promise<Result<Artist[]>>;
  saveAll(artists: Artist[]): Promise<Result<void>>;
}
