import { describe, test, beforeEach } from 'vitest';
import { stateBuilderProvider } from '@/shared/store/__tests__/state.builder.ts';
import {
  CARD_CLASSES,
  CARD_FOILINGS,
  CARD_KEYWORDS,
  CARD_RARITIES,
  CARD_SETS,
  CARD_SUBTYPES,
  CARD_TALENTS,
  CARD_TYPES,
} from '@codex/core';
import {
  createFiltersSliceFixture,
  type FiltersSliceFixture,
} from '@/domain/filter/domain/__tests__/filters.slice.fixture.ts';
import { initialFiltersState } from '@/domain/filter/domain/filters.slice.ts';

describe('Feature: Filtering cards', () => {
  let fixture: FiltersSliceFixture;

  beforeEach(() => {
    fixture = createFiltersSliceFixture(stateBuilderProvider());
  });

  test('Rule: I should be able to filter cards by class', () => {
    fixture.whenAddingClassFilter([CARD_CLASSES.Generic, CARD_CLASSES.Ninja]);
    fixture.thenFiltersShouldBe({ classes: [CARD_CLASSES.Generic, CARD_CLASSES.Ninja] });
  });

  test('Rule: I should be able to filter cards by talent', () => {
    fixture.whenAddingTalentFilter([CARD_TALENTS.Shadow, CARD_TALENTS.Draconic]);
    fixture.thenFiltersShouldBe({ talents: [CARD_TALENTS.Shadow, CARD_TALENTS.Draconic] });
  });

  test('Rule: I should be able to filter cards by type', () => {
    fixture.whenAddingTypeFilter([CARD_TYPES.Action, CARD_TYPES.DefenseReaction]);
    fixture.thenFiltersShouldBe({ types: [CARD_TYPES.Action, CARD_TYPES.DefenseReaction] });
  });

  test('Rule: I should be able to filter cards by subtype', () => {
    fixture.whenAddingSubtypeFilter([CARD_SUBTYPES.Arrow, CARD_SUBTYPES.Chi]);
    fixture.thenFiltersShouldBe({ subtypes: [CARD_SUBTYPES.Arrow, CARD_SUBTYPES.Chi] });
  });

  test('Rule: I should be able to filter cards by keyword', () => {
    fixture.whenAddingKeywordFilter([CARD_KEYWORDS.Dominate, CARD_KEYWORDS.GoAgain]);
    fixture.thenFiltersShouldBe({ keywords: [CARD_KEYWORDS.Dominate, CARD_KEYWORDS.GoAgain] });
  });

  test('Rule: I should be able to filter cards by set', () => {
    fixture.whenAddingSetFilter([CARD_SETS.WelcomeToRathe, CARD_SETS.ArcaneRising]);
    fixture.thenFiltersShouldBe({ sets: [CARD_SETS.WelcomeToRathe, CARD_SETS.ArcaneRising] });
  });

  test('Rule: I should be able to filter cards by rarity', () => {
    fixture.whenAddingRarityFilter([CARD_RARITIES.Rare, CARD_RARITIES.Majestic]);
    fixture.thenFiltersShouldBe({ rarities: [CARD_RARITIES.Rare, CARD_RARITIES.Majestic] });
  });

  test('Rule: I should be able to filter cards by foiling', () => {
    fixture.whenAddingFoilingFilter([CARD_FOILINGS.Rainbow, CARD_FOILINGS.Cold]);
    fixture.thenFiltersShouldBe({ foilings: [CARD_FOILINGS.Rainbow, CARD_FOILINGS.Cold] });
  });

  test('Rule: I should be able to filter cards by artist', () => {
    fixture.whenAddingArtistFilter(['Micah Epstein', 'Dominik Mayer']);
    fixture.thenFiltersShouldBe({ artists: ['Micah Epstein', 'Dominik Mayer'] });
  });

  test('Rule: I should be able to reset all active filters at once', () => {
    fixture.givenActiveFilters((b) =>
      b
        .withClasses([CARD_CLASSES.Generic])
        .withTalents([CARD_TALENTS.Draconic])
        .withTypes([CARD_TYPES.Action, CARD_TYPES.DefenseReaction])
        .withSubtypes([CARD_SUBTYPES.Arrow, CARD_SUBTYPES.Chi])
        .withKeywords([CARD_KEYWORDS.Dominate, CARD_KEYWORDS.GoAgain])
        .withSets([CARD_SETS.WelcomeToRathe, CARD_SETS.ArcaneRising])
        .withRarities([CARD_RARITIES.Rare, CARD_RARITIES.Majestic])
        .withFoilings([CARD_FOILINGS.Rainbow, CARD_FOILINGS.Cold])
        .withArtists(['Micah Epstein', 'Dominik Mayer']),
    );
    fixture.whenResettingFilters();
    fixture.thenFiltersShouldBe(initialFiltersState);
  });
});
