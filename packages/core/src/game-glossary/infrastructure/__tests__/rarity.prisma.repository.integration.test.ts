import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createPrismaRarityRepositoryFixture } from './rarity.prisma.repository.fixture';

describe('Integration: Persisting rarities', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting rarities', () => {
    test('Rule: It should return an empty list when no rarities have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaRarityRepositoryFixture(tx);

        await fixture.givenPreExistingRarities([]);

        await fixture.whenGettingRarities();

        fixture.thenStoredRaritiesShouldBe([]);
      });
    });

    test('Rule: It should return the list of stored rarities', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaRarityRepositoryFixture(tx);

        await fixture.givenPreExistingRarities(['Majestic']);
        await fixture.whenGettingRarities();

        fixture.thenStoredRaritiesShouldBe(['Majestic']);
      });
    });

    test('Rule: It should order the rarities by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaRarityRepositoryFixture(tx);

        await fixture.givenPreExistingRarities(['Majestic', 'Common', 'Rare']);
        await fixture.whenGettingRarities();

        fixture.thenStoredRaritiesShouldBe(['Common', 'Majestic', 'Rare']);
      });
    });
  });

  describe('Feature: Importing rarities', () => {
    test('Rule: It should save imported rarities', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaRarityRepositoryFixture(tx);

        await fixture.givenPreExistingRarities([]);

        await fixture.whenImportingRarities(['Majestic']);

        fixture.thenStoredRaritiesShouldBe(['Majestic']);
      });
    });

    test('Rule: It should not duplicate a rarity that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaRarityRepositoryFixture(tx);

        await fixture.givenPreExistingRarities(['Majestic']);

        await fixture.whenImportingRarities(['Majestic']);

        fixture.thenStoredRaritiesShouldBe(['Majestic']);
      });
    });
  });
});
