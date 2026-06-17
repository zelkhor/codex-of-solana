import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createPrismaEditionRepositoryFixture } from './edition.prisma.repository.fixture';

describe('Integration: Persisting editions', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting editions', () => {
    test('Rule: It should return an empty list when no editions have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaEditionRepositoryFixture(tx);

        await fixture.givenPreExistingEditions([]);

        await fixture.whenGettingEditions();

        fixture.thenStoredEditionsShouldBe([]);
      });
    });

    test('Rule: It should return the list of stored editions', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaEditionRepositoryFixture(tx);

        await fixture.givenPreExistingEditions(['Unlimited']);
        await fixture.whenGettingEditions();

        fixture.thenStoredEditionsShouldBe(['Unlimited']);
      });
    });

    test('Rule: It should order the editions by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaEditionRepositoryFixture(tx);

        await fixture.givenPreExistingEditions(['Unlimited', 'Alpha', 'First']);
        await fixture.whenGettingEditions();

        fixture.thenStoredEditionsShouldBe(['Alpha', 'First', 'Unlimited']);
      });
    });
  });

  describe('Feature: Importing editions', () => {
    test('Rule: It should save imported editions', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaEditionRepositoryFixture(tx);

        await fixture.givenPreExistingEditions([]);

        await fixture.whenImportingEditions(['Unlimited']);

        fixture.thenStoredEditionsShouldBe(['Unlimited']);
      });
    });

    test('Rule: It should not duplicate an edition that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaEditionRepositoryFixture(tx);

        await fixture.givenPreExistingEditions(['Unlimited']);

        await fixture.whenImportingEditions(['Unlimited']);

        fixture.thenStoredEditionsShouldBe(['Unlimited']);
      });
    });
  });
});
