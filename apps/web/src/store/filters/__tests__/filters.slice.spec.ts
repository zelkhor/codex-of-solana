import { describe, test, beforeEach } from 'vitest';
import { stateBuilderProvider } from '@/store/__tests__/state.builder';
import { createFiltersFixture, type FiltersFixture } from './filters.fixture';
import {
  CARD_CLASSES,
  CARD_FOILINGS,
  CARD_KEYWORDS,
  CARD_RARITIES,
  CARD_SETS,
  CARD_TALENTS,
  CARD_TYPES,
} from '@codex/core';

describe('Feature: Filtering cards', () => {
  let fixture: FiltersFixture;

  beforeEach(() => {
    fixture = createFiltersFixture(stateBuilderProvider());
  });

  test('Rule: I should be able to filter cards by class', () => {
    fixture.whenAddingClassFilter([CARD_CLASSES.Generic]);
    fixture.thenFiltersShouldBe({ classes: [CARD_CLASSES.Generic] });
  });

  test('Rule: I should be able to filter cards by talent', () => {
    fixture.whenAddingTalentFilter([CARD_TALENTS.Shadow]);
    fixture.thenFiltersShouldBe({ talents: [CARD_TALENTS.Shadow] });
  });

  test('Rule: I should be able to filter cards by type', () => {
    fixture.whenAddingTypeFilter([CARD_TYPES.Action]);
    fixture.thenFiltersShouldBe({ types: [CARD_TYPES.Action] });
  });

  test('Rule: I should be able to filter cards by keyword', () => {
    fixture.whenAddingKeywordFilter([CARD_KEYWORDS.Dominate]);
    fixture.thenFiltersShouldBe({ keywords: [CARD_KEYWORDS.Dominate] });
  });

  test('Rule: I should be able to filter cards by set', () => {
    fixture.whenAddingSetFilter([CARD_SETS.WelcomeToRathe]);
    fixture.thenFiltersShouldBe({ sets: [CARD_SETS.WelcomeToRathe] });
  });

  test('Rule: I should be able to filter cards by rarity', () => {
    fixture.whenAddingRarityFilter([CARD_RARITIES.Rare, CARD_RARITIES.Majestic]);
    fixture.thenFiltersShouldBe({ rarities: [CARD_RARITIES.Rare, CARD_RARITIES.Majestic] });
  });

  test('Rule: I should be able to filter cards by foiling', () => {
    fixture.whenAddingFoilingFilter([CARD_FOILINGS.Rainbow]);
    fixture.thenFiltersShouldBe({ foilings: [CARD_FOILINGS.Rainbow] });
  });

  test('Rule: I should be able to reset all active filters at once', () => {
    fixture.givenActiveFilters((b) =>
      b.withClasses([CARD_CLASSES.Generic]).withFoilings([CARD_FOILINGS.Rainbow]),
    );
    fixture.whenResettingFilters();
    fixture.thenFiltersShouldBe({ classes: [], foilings: [], rarities: [] });
  });
});
