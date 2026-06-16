import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createTalentPrismaRepositoryFixture } from './talent.prisma.repository.fixture';

describe('Integration: Persisting game talents', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting talents', () => {
    test('Rule: It should return an empty list when no talents have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createTalentPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingTalents([]);

        await fixture.whenGettingTalents();

        fixture.thenStoredTalentsShouldBe([]);
      });
    });

    test('Rule: It should return the list of stored talents', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createTalentPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingTalents(['Lightning']);
        await fixture.whenGettingTalents();

        fixture.thenStoredTalentsShouldBe(['Lightning']);
      });
    });

    test('Rule: It should order the talents by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createTalentPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingTalents(['Shadow', 'Earth', 'Chaos']);
        await fixture.whenGettingTalents();

        fixture.thenStoredTalentsShouldBe(['Chaos', 'Earth', 'Shadow']);
      });
    });
  });

  describe('Feature: Importing talents', () => {
    test('Rule: It should save imported talents', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createTalentPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingTalents([]);

        await fixture.whenImportingTalents(['Lightning']);

        fixture.thenStoredTalentsShouldBe(['Lightning']);
      });
    });

    test('Rule: It should not duplicate a talent that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createTalentPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingTalents(['Lightning']);

        await fixture.whenImportingTalents(['Lightning']);

        fixture.thenStoredTalentsShouldBe(['Lightning']);
      });
    });
  });
});
