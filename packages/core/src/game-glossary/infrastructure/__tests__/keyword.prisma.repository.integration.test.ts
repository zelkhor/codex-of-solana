import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createPrismaKeywordRepositoryFixture } from './keyword.prisma.repository.fixture';

describe('Integration: Persisting keywords', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting keywords', () => {
    test('Rule: It should return an empty list when no keywords have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaKeywordRepositoryFixture(tx);

        await fixture.givenPreExistingKeywords([]);

        await fixture.whenGettingKeywords();

        fixture.thenStoredKeywordsShouldBe([]);
      });
    });

    test('Rule: It should return the list of stored keywords', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaKeywordRepositoryFixture(tx);

        await fixture.givenPreExistingKeywords(['Dominate']);
        await fixture.whenGettingKeywords();

        fixture.thenStoredKeywordsShouldBe(['Dominate']);
      });
    });

    test('Rule: It should order the keywords by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaKeywordRepositoryFixture(tx);

        await fixture.givenPreExistingKeywords(['Dominate', 'Ambush', 'Charge']);
        await fixture.whenGettingKeywords();

        fixture.thenStoredKeywordsShouldBe(['Ambush', 'Charge', 'Dominate']);
      });
    });
  });

  describe('Feature: Importing keywords', () => {
    test('Rule: It should save imported keywords', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaKeywordRepositoryFixture(tx);

        await fixture.givenPreExistingKeywords([]);

        await fixture.whenImportingKeywords(['Dominate']);

        fixture.thenStoredKeywordsShouldBe(['Dominate']);
      });
    });

    test('Rule: It should not duplicate a keyword that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaKeywordRepositoryFixture(tx);

        await fixture.givenPreExistingKeywords(['Dominate']);

        await fixture.whenImportingKeywords(['Dominate']);

        fixture.thenStoredKeywordsShouldBe(['Dominate']);
      });
    });
  });
});
