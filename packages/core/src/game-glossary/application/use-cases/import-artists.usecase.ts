import { type Result, err } from '../../../shared/helpers/result';
import { Artist } from '../../domain/artist';
import type { IArtistRepository } from '../artist.repository';

export type ImportArtistsCommand = {
  names: string[];
};

export class ImportArtistsUseCase {
  constructor(private readonly repository: IArtistRepository) {}

  async execute(command: ImportArtistsCommand): Promise<Result<void>> {
    const artists: Artist[] = [];

    for (const name of command.names) {
      const result = Artist.create(name);
      if (!result.ok) return err(result.error);
      artists.push(result.value);
    }

    return this.repository.saveAll(artists);
  }
}
