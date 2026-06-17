import type { Prisma } from '@codex/orm';

import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';
import type { IArtistRepository } from '../application/artist.repository';
import { Artist } from '../domain/artist';

export class ArtistRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'ARTIST_REPOSITORY_ERROR',
      cause ? `Artist repository failure: ${cause}` : 'Artist repository failure',
    );
  }
}

export class ArtistPrismaRepository implements IArtistRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Artist[]>> {
    try {
      const rows = await this.prisma.artist.findMany({ orderBy: { name: 'asc' } });

      const artists: Artist[] = [];

      for (const row of rows) {
        const result = Artist.create(row.name);
        if (!result.ok) return err(result.error);
        artists.push(result.value);
      }

      return ok(artists);
    } catch (error) {
      return err(new ArtistRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(artists: Artist[]): Promise<Result<void>> {
    try {
      await this.prisma.artist.createMany({
        data: artists.map((artist) => ({ name: artist.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new ArtistRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
