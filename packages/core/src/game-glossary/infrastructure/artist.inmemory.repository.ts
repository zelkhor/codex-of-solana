import { type Result, ok } from '../../shared/helpers/result';
import type { IArtistRepository } from '../application/artist.repository';
import type { Artist } from '../domain/artist';

export class InMemoryArtistRepository implements IArtistRepository {
  private artists = new Map<string, Artist>();

  setArtists(artists: Artist[]): this {
    this.artists = new Map(artists.map((artist) => [artist.name, artist]));
    return this;
  }

  async findAll(): Promise<Result<Artist[]>> {
    return ok([...this.artists.values()]);
  }

  async saveAll(artists: Artist[]): Promise<Result<void>> {
    artists.forEach((artist) => this.artists.set(artist.name, artist));
    return ok(undefined);
  }
}
