import { beforeEach, describe, test } from 'vitest';

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

import type { StateBuilder } from '@/shared/store/__tests__/state.builder.ts';
import { stateBuilderProvider } from '@/shared/store/__tests__/state.builder.ts';

import {
  type FiltersSelectorsFixture,
  createFiltersSelectorsFixture,
} from '@/domain/filter/domain/__tests__/filters.selectors.fixture.ts';

describe('Feature: Detecting whether any filter is active', () => {
  let fixture: FiltersSelectorsFixture;

  beforeEach(() => {
    fixture = createFiltersSelectorsFixture(stateBuilderProvider());
  });

  test('Rule: Returns false when no filters are active', () => {
    fixture.thenShouldNotHaveAnyActiveFilters();
  });

  test.each([
    ['class', (b: StateBuilder) => b.withClasses([CARD_CLASSES.Generic])],
    ['talent', (b: StateBuilder) => b.withTalents([CARD_TALENTS.Shadow])],
    ['type', (b: StateBuilder) => b.withTypes([CARD_TYPES.Action])],
    ['subtype', (b: StateBuilder) => b.withSubtypes([Object.values(CARD_SUBTYPES)[0]])],
    ['keyword', (b: StateBuilder) => b.withKeywords([CARD_KEYWORDS.Dominate])],
    ['set', (b: StateBuilder) => b.withSets([CARD_SETS.WelcomeToRathe])],
    ['rarity', (b: StateBuilder) => b.withRarities([CARD_RARITIES.Common])],
    ['foiling', (b: StateBuilder) => b.withFoilings([CARD_FOILINGS.Rainbow])],
    ['artist', (b: StateBuilder) => b.withArtists(['Micah Epstein'])],
    ['search query', (b: StateBuilder) => b.withSearchQuery('ninja')],
  ])('Rule: Returns true when a %s filter is active', (_, setup) => {
    fixture.givenFilters(setup);
    fixture.thenShouldHaveActiveFilters();
  });
});
