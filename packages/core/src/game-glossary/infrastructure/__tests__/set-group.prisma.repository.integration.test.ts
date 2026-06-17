import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createPrismaSetGroupRepositoryFixture } from './set-group.prisma.repository.fixture';

describe('Integration: Persisting set groups', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting set groups', () => {
    test('Rule: It should return an empty list when no groups have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaSetGroupRepositoryFixture(tx);

        await fixture.givenPreExistingGroups([]);

        await fixture.whenGettingGroups();

        fixture.thenStoredGroupsShouldBe([]);
      });
    });

    test('Rule: It should order the groups by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaSetGroupRepositoryFixture(tx);

        await fixture.givenPreExistingGroups(['Main Sets', 'Blitz Decks', 'Hero Decks']);
        await fixture.whenGettingGroups();

        fixture.thenStoredGroupsShouldBe(['Blitz Decks', 'Hero Decks', 'Main Sets']);
      });
    });
  });

  describe('Feature: Creating a set group', () => {
    test('Rule: It should save a created group', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaSetGroupRepositoryFixture(tx);

        await fixture.givenPreExistingGroups([]);

        await fixture.whenCreatingGroup('Main Sets');

        fixture.thenStoredGroupsShouldBe(['Main Sets']);
      });
    });
  });
});
