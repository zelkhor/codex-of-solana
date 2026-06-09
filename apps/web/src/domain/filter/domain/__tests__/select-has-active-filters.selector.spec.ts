import {
  CLASSES,
  FOILINGS,
  HEROES,
  KEYWORDS,
  RARITIES,
  SETS,
  SUBTYPES,
  TALENTS,
  TYPES,
} from '@codex/core';

import { FILTER_MODES } from '@/shared/types/filter-mode.ts';

import {
  type FiltersSelectorsFixture,
  createFiltersSelectorsFixture,
} from '@/domain/filter/domain/__tests__/filters.selectors.fixture.ts';
import type { StateBuilder } from '@/domain/store/__tests__/state.builder.ts';
import { stateBuilderProvider } from '@/domain/store/__tests__/state.builder.ts';

describe('Feature: Detecting whether any filter is active', () => {
  let fixture: FiltersSelectorsFixture;

  beforeEach(() => {
    fixture = createFiltersSelectorsFixture(stateBuilderProvider());
  });

  test('Rule: Returns false when no filters are active', () => {
    fixture.thenShouldNotHaveAnyActiveFilters();
  });

  test.each([
    ['class', (b: StateBuilder) => b.withClasses([CLASSES.Generic])],
    ['class exact mode', (b: StateBuilder) => b.withClassFilterMode(FILTER_MODES.EXACT)],
    ['talent', (b: StateBuilder) => b.withTalents([TALENTS.Shadow])],
    ['talent exact mode', (b: StateBuilder) => b.withTalentFilterMode(FILTER_MODES.EXACT)],
    ['type', (b: StateBuilder) => b.withTypes([TYPES.Action])],
    ['type exact mode', (b: StateBuilder) => b.withTypeFilterMode(FILTER_MODES.EXACT)],
    ['subtype', (b: StateBuilder) => b.withSubtypes([Object.values(SUBTYPES)[0]])],
    ['subtype exact mode', (b: StateBuilder) => b.withSubtypeFilterMode(FILTER_MODES.EXACT)],
    ['keyword', (b: StateBuilder) => b.withKeywords([KEYWORDS.Dominate])],
    ['keyword exact mode', (b: StateBuilder) => b.withKeywordFilterMode(FILTER_MODES.EXACT)],
    ['set', (b: StateBuilder) => b.withSets([SETS.WelcomeToRathe])],
    ['rarity', (b: StateBuilder) => b.withRarities([RARITIES.Common])],
    ['foiling', (b: StateBuilder) => b.withFoilings([FOILINGS.Rainbow])],
    ['treatment', (b: StateBuilder) => b.withTreatments(['Alternate Art'])],
    ['treatment exact mode', (b: StateBuilder) => b.withTreatmentFilterMode(FILTER_MODES.EXACT)],
    ['artist', (b: StateBuilder) => b.withArtists(['Micah Epstein'])],
    ['hero', (b: StateBuilder) => b.withHero(HEROES.Katsu)],
    ['format', (b: StateBuilder) => b.withFormat('Blitz')],
    ['search query', (b: StateBuilder) => b.withSearchQuery('ninja')],
  ])('Rule: Returns true when a %s filter is active', (_, setup) => {
    fixture.givenFilters(setup);
    fixture.thenShouldHaveActiveFilters();
  });
});
