import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createFormatPrismaRepositoryFixture } from './format.prisma.repository.fixture';

describe('Integration: Persisting formats', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting formats', () => {
    test('Rule: It should return an empty list when no formats have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createFormatPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingFormats([]);

        await fixture.whenGettingFormats();

        fixture.thenStoredFormatsShouldBe([]);
      });
    });

    test('Rule: It should return the list of stored formats', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createFormatPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingFormats(['Blitz']);
        await fixture.whenGettingFormats();

        fixture.thenStoredFormatsShouldBe(['Blitz']);
      });
    });

    test('Rule: It should order the formats by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createFormatPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingFormats(['Draft', 'Blitz', 'Classic Constructed']);
        await fixture.whenGettingFormats();

        fixture.thenStoredFormatsShouldBe(['Blitz', 'Classic Constructed', 'Draft']);
      });
    });
  });

  describe('Feature: Importing formats', () => {
    test('Rule: It should save imported formats', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createFormatPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingFormats([]);

        await fixture.whenImportingFormats(['Blitz']);

        fixture.thenStoredFormatsShouldBe(['Blitz']);
      });
    });

    test('Rule: It should not duplicate a format that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createFormatPrismaRepositoryFixture(tx);

        await fixture.givenPreExistingFormats(['Blitz']);

        await fixture.whenImportingFormats(['Blitz']);

        fixture.thenStoredFormatsShouldBe(['Blitz']);
      });
    });
  });
});
