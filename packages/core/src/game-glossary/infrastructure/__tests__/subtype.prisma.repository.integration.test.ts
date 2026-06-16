import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createSubtypePrismaRepositoryFixture } from './subtype.prisma.repository.fixture';

describe('Integration: Persisting card subtypes', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting subtypes', () => {
    test('Rule: It should return an empty list when no subtypes have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createSubtypePrismaRepositoryFixture(tx);

        await fixture.givenPreExistingSubtypes([]);

        await fixture.whenGettingSubtypes();

        fixture.thenStoredSubtypesShouldBe([]);
      });
    });

    test('Rule: It should return the list of stored subtypes', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createSubtypePrismaRepositoryFixture(tx);

        await fixture.givenPreExistingSubtypes(['Sword']);
        await fixture.whenGettingSubtypes();

        fixture.thenStoredSubtypesShouldBe(['Sword']);
      });
    });

    test('Rule: It should order the subtypes by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createSubtypePrismaRepositoryFixture(tx);

        await fixture.givenPreExistingSubtypes(['Sword', 'Axe', 'Dagger']);
        await fixture.whenGettingSubtypes();

        fixture.thenStoredSubtypesShouldBe(['Axe', 'Dagger', 'Sword']);
      });
    });
  });

  describe('Feature: Importing subtypes', () => {
    test('Rule: It should save imported subtypes', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createSubtypePrismaRepositoryFixture(tx);

        await fixture.givenPreExistingSubtypes([]);

        await fixture.whenImportingSubtypes(['Sword']);

        fixture.thenStoredSubtypesShouldBe(['Sword']);
      });
    });

    test('Rule: It should not duplicate a subtype that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createSubtypePrismaRepositoryFixture(tx);

        await fixture.givenPreExistingSubtypes(['Sword']);

        await fixture.whenImportingSubtypes(['Sword']);

        fixture.thenStoredSubtypesShouldBe(['Sword']);
      });
    });
  });
});
