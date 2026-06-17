import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createPrismaFoilingRepositoryFixture } from './foiling.prisma.repository.fixture';

describe('Integration: Persisting foilings', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting foilings', () => {
    test('Rule: It should return an empty list when no foilings have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaFoilingRepositoryFixture(tx);

        await fixture.givenPreExistingFoilings([]);

        await fixture.whenGettingFoilings();

        fixture.thenStoredFoilingsShouldBe([]);
      });
    });

    test('Rule: It should return the list of stored foilings', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaFoilingRepositoryFixture(tx);

        await fixture.givenPreExistingFoilings(['Rainbow']);
        await fixture.whenGettingFoilings();

        fixture.thenStoredFoilingsShouldBe(['Rainbow']);
      });
    });

    test('Rule: It should order the foilings by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaFoilingRepositoryFixture(tx);

        await fixture.givenPreExistingFoilings(['Regular', 'Cold', 'Gold']);
        await fixture.whenGettingFoilings();

        fixture.thenStoredFoilingsShouldBe(['Cold', 'Gold', 'Regular']);
      });
    });
  });

  describe('Feature: Importing foilings', () => {
    test('Rule: It should save imported foilings', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaFoilingRepositoryFixture(tx);

        await fixture.givenPreExistingFoilings([]);

        await fixture.whenImportingFoilings(['Rainbow']);

        fixture.thenStoredFoilingsShouldBe(['Rainbow']);
      });
    });

    test('Rule: It should not duplicate a foiling that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaFoilingRepositoryFixture(tx);

        await fixture.givenPreExistingFoilings(['Rainbow']);

        await fixture.whenImportingFoilings(['Rainbow']);

        fixture.thenStoredFoilingsShouldBe(['Rainbow']);
      });
    });
  });
});
