import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createPrismaTypeRepositoryFixture } from './type.prisma.repository.fixture';

describe('Integration: Persisting types', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting types', () => {
    test('Rule: It should return an empty list when no types have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaTypeRepositoryFixture(tx);

        await fixture.givenPreExistingTypes([]);

        await fixture.whenGettingTypes();

        fixture.thenStoredTypesShouldBe([]);
      });
    });

    test('Rule: It should return the list of stored types', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaTypeRepositoryFixture(tx);

        await fixture.givenPreExistingTypes(['Weapon']);
        await fixture.whenGettingTypes();

        fixture.thenStoredTypesShouldBe(['Weapon']);
      });
    });

    test('Rule: It should order the types by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaTypeRepositoryFixture(tx);

        await fixture.givenPreExistingTypes(['Weapon', 'Action', 'Instant']);
        await fixture.whenGettingTypes();

        fixture.thenStoredTypesShouldBe(['Action', 'Instant', 'Weapon']);
      });
    });
  });

  describe('Feature: Importing types', () => {
    test('Rule: It should save imported types', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaTypeRepositoryFixture(tx);

        await fixture.givenPreExistingTypes([]);

        await fixture.whenImportingTypes(['Weapon']);

        fixture.thenStoredTypesShouldBe(['Weapon']);
      });
    });

    test('Rule: It should not duplicate a type that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaTypeRepositoryFixture(tx);

        await fixture.givenPreExistingTypes(['Weapon']);

        await fixture.whenImportingTypes(['Weapon']);

        fixture.thenStoredTypesShouldBe(['Weapon']);
      });
    });
  });
});
