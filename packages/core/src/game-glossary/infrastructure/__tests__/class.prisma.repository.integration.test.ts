import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createClassPrismaRepositoryFixture } from './class.prisma.repository.fixture';

describe('Integration: Persisting game classes', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting classes', () => {
    test('Rule: It should return an empty list when no classes have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createClassPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingClasses([]);

        await fixture.whenGettingClasses();

        fixture.thenStoredClassesShouldBe([]);
      });
    });

    test('Rule: It should return the list of stored classes', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createClassPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingClasses(['Wizard']);
        await fixture.whenGettingClasses();

        fixture.thenStoredClassesShouldBe(['Wizard']);
      });
    });

    test('Rule: It should order the classes by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createClassPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingClasses(['Wizard', 'Bard', 'Assassin']);
        await fixture.whenGettingClasses();

        fixture.thenStoredClassesShouldBe(['Assassin', 'Bard', 'Wizard']);
      });
    });
  });

  describe('Feature: Importing classes', () => {
    test('Rule: It should save imported classes', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createClassPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingClasses([]);

        await fixture.whenImportingClasses(['Wizard']);

        fixture.thenStoredClassesShouldBe(['Wizard']);
      });
    });

    test('Rule: It should not duplicate a class that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createClassPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingClasses(['Wizard']);

        await fixture.whenImportingClasses(['Wizard']);

        fixture.thenStoredClassesShouldBe(['Wizard']);
      });
    });
  });
});
