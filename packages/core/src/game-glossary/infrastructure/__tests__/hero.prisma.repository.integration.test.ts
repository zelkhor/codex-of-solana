import type { PrismaClient } from '@codex/orm';
import { createTestPrismaClient, wrapInTransaction } from '@codex/orm/__tests__/test-database';

import { heroBuilder } from '../../../__tests__';
import { createPrismaHeroRepositoryFixture } from './hero.prisma.repository.fixture';

describe('Integration: Persisting heroes', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = createTestPrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Feature: Getting heroes', () => {
    test('Rule: It should return an empty list when no heroes have been stored yet', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaHeroRepositoryFixture(tx);

        await fixture.whenGettingHeroes();

        fixture.thenStoredHeroesShouldBe([]);
      });
    });

    test('Rule: It should return the stored heroes ordered by name', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaHeroRepositoryFixture(tx);

        const adultHero = heroBuilder()
          .withName('Adult Hero')
          .withIsYoung(false)
          .withCounterpart(null)
          .build();
        const youngHero = heroBuilder()
          .withName('Young Hero')
          .withIsYoung(true)
          .withCounterpart(null)
          .build();

        await fixture.whenImportingHeroes([youngHero, adultHero]);

        fixture.thenStoredHeroesShouldBe([adultHero, youngHero]);
      });
    });
  });

  describe('Feature: Importing heroes', () => {
    test('Rule: It should save heroes with no counterpart unlinked', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaHeroRepositoryFixture(tx);

        const adultHero = heroBuilder()
          .withName('Adult Hero')
          .withIsYoung(false)
          .withCounterpart(null)
          .build();
        const youngHero = heroBuilder()
          .withName('Young Hero')
          .withIsYoung(true)
          .withCounterpart(null)
          .build();

        await fixture.whenImportingHeroes([adultHero, youngHero]);

        fixture.thenStoredHeroesShouldBe([adultHero, youngHero]);
      });
    });

    test('Rule: It should link heroes imported with their counterparts', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaHeroRepositoryFixture(tx);

        const youngHero = heroBuilder()
          .withName('Young Hero')
          .withIsYoung(true)
          .withCounterpart('Adult Hero')
          .build();
        const adultHero = heroBuilder()
          .withName('Adult Hero')
          .withIsYoung(false)
          .withCounterpart('Young Hero')
          .build();

        await fixture.whenImportingHeroes([youngHero, adultHero]);

        fixture.thenStoredHeroesShouldBe([adultHero, youngHero]);
      });
    });

    test('Rule: It should not duplicate a hero that already exists', async () => {
      await wrapInTransaction(prisma, async (tx) => {
        const fixture = createPrismaHeroRepositoryFixture(tx);

        const youngHero = heroBuilder()
          .withName('Young Hero')
          .withIsYoung(true)
          .withCounterpart(null)
          .build();

        await fixture.whenImportingHeroes([youngHero]);
        await fixture.whenImportingHeroes([youngHero]);

        fixture.thenStoredHeroesShouldBe([youngHero]);
      });
    });
  });
});
