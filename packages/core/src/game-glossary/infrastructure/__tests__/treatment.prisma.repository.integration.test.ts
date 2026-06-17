import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { createPrismaTreatmentRepositoryFixture } from './treatment.prisma.repository.fixture';

describe('Integration: Persisting treatments', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting treatments', () => {
    test('Rule: It should return an empty list when no treatments have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaTreatmentRepositoryFixture(tx);

        await fixture.givenPreExistingTreatments([]);

        await fixture.whenGettingTreatments();

        fixture.thenStoredTreatmentsShouldBe([]);
      });
    });

    test('Rule: It should return the list of stored treatments', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaTreatmentRepositoryFixture(tx);

        await fixture.givenPreExistingTreatments(['Full Art']);
        await fixture.whenGettingTreatments();

        fixture.thenStoredTreatmentsShouldBe(['Full Art']);
      });
    });

    test('Rule: It should order the treatments by name ASC', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaTreatmentRepositoryFixture(tx);

        await fixture.givenPreExistingTreatments(['Full Art', 'Alternate Art', 'Extended Art']);
        await fixture.whenGettingTreatments();

        fixture.thenStoredTreatmentsShouldBe(['Alternate Art', 'Extended Art', 'Full Art']);
      });
    });
  });

  describe('Feature: Importing treatments', () => {
    test('Rule: It should save imported treatments', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaTreatmentRepositoryFixture(tx);

        await fixture.givenPreExistingTreatments([]);

        await fixture.whenImportingTreatments(['Full Art']);

        fixture.thenStoredTreatmentsShouldBe(['Full Art']);
      });
    });

    test('Rule: It should not duplicate a treatment that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaTreatmentRepositoryFixture(tx);

        await fixture.givenPreExistingTreatments(['Full Art']);

        await fixture.whenImportingTreatments(['Full Art']);

        fixture.thenStoredTreatmentsShouldBe(['Full Art']);
      });
    });
  });
});
