import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { setReleaseBuilder } from '../../../__tests__';
import { createPrismaSetReleaseRepositoryFixture } from './set-release.prisma.repository.fixture';

describe('Integration: Persisting set releases', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting set releases', () => {
    test('Rule: It should return an empty list when no sets have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaSetReleaseRepositoryFixture(tx);

        await fixture.whenGettingSets();

        fixture.thenStoredSetNamesShouldBe([]);
      });
    });

    test('Rule: It should order sets by release date, then by release order for ties', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaSetReleaseRepositoryFixture(tx);

        await fixture.givenExistingGroups(['Main Sets', 'Armory Decks']);
        await fixture.whenImportingSets([
          setReleaseBuilder().withName('Later Set').withReleaseDate(new Date('2024-01-10')).build(),
          setReleaseBuilder()
            .withName('Armory Same Day')
            .withGroup('Armory Decks')
            .withReleaseDate(new Date('2024-01-01'))
            .withReleaseOrder(1)
            .build(),
          setReleaseBuilder()
            .withName('Main Same Day')
            .withReleaseDate(new Date('2024-01-01'))
            .withReleaseOrder(0)
            .build(),
        ]);

        fixture.thenStoredSetNamesShouldBe(['Main Same Day', 'Armory Same Day', 'Later Set']);
      });
    });
  });

  describe('Feature: Importing set releases', () => {
    test('Rule: It should not duplicate a set that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaSetReleaseRepositoryFixture(tx);

        await fixture.givenExistingGroups(['Main Sets']);
        await fixture.whenImportingSets([setReleaseBuilder().withName('Rosetta').build()]);
        await fixture.whenImportingSets([setReleaseBuilder().withName('Rosetta').build()]);

        fixture.thenStoredSetNamesShouldBe(['Rosetta']);
      });
    });

    test('Rule: It should fail when a set references a group that does not exist', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaSetReleaseRepositoryFixture(tx);

        await fixture.whenImportingSetsExpectingFailure([
          setReleaseBuilder().withGroup('Missing Group').build(),
        ]);

        fixture.thenImportShouldHaveFailed();
      });
    });
  });
});
