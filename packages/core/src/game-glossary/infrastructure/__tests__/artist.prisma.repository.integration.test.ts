import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createArtistPrismaRepositoryFixture } from './artist.prisma.repository.fixture';

describe('Integration: Persisting artists', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting artists', () => {
    test('Rule: It should return an empty list when no artists have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createArtistPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingArtists([]);

        await fixture.whenGettingArtists();

        fixture.thenStoredArtistsShouldBe([]);
      });
    });

    test('Rule: It should order the artists by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createArtistPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingArtists(['Tomasz Jedruszek', 'AOJI Maiko', 'Faizal Fikri']);
        await fixture.whenGettingArtists();

        fixture.thenStoredArtistsShouldBe(['AOJI Maiko', 'Faizal Fikri', 'Tomasz Jedruszek']);
      });
    });
  });

  describe('Feature: Importing artists', () => {
    test('Rule: It should save imported artists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createArtistPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingArtists([]);

        await fixture.whenImportingArtists(['Tomasz Jedruszek']);

        fixture.thenStoredArtistsShouldBe(['Tomasz Jedruszek']);
      });
    });

    test('Rule: It should not duplicate an artist that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createArtistPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingArtists(['Tomasz Jedruszek']);

        await fixture.whenImportingArtists(['Tomasz Jedruszek']);

        fixture.thenStoredArtistsShouldBe(['Tomasz Jedruszek']);
      });
    });
  });
});
