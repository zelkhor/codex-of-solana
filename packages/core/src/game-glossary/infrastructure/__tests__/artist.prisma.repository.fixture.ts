import { ArtistFactory } from '@codex/orm/__tests__/factories/artist.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Artist } from '../../domain/artist';
import { ArtistPrismaRepository } from '../artist.prisma.repository';

const toArtist = (name: string): Artist => {
  const result = Artist.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createArtistPrismaRepositoryFixture = (tx: TransactionClient) => {
  const repository = new ArtistPrismaRepository(tx);
  let storedArtists: Artist[] = [];

  return {
    async givenPreExistingArtists(names: string[]) {
      for (const name of names) await ArtistFactory.create({ name });
    },
    async whenImportingArtists(names: string[]) {
      const result = await repository.saveAll(names.map(toArtist));
      expectOk(result);
      await this.whenGettingArtists();
    },
    async whenGettingArtists() {
      const result = await repository.findAll();
      expectOk(result);
      storedArtists = result.value;
    },
    thenStoredArtistsShouldBe(expectedNames: string[]) {
      expect(storedArtists.map((a) => a.name)).toEqual(expectedNames);
    },
  };
};
