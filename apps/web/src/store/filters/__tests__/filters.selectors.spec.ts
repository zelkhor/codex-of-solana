import { describe, test, expect } from 'vitest';
import { selectFilters, selectSearchQuery, selectHasActiveFilters } from '../filters.selectors';
import { stateBuilder, type StateBuilder } from '@/store/__tests__/state.builder';
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

describe('Feature: Filter selectors', () => {
  describe('selectHasActiveFilters', () => {
    test('Rule: returns false when no filters are active', () => {
      expect(selectHasActiveFilters(stateBuilder().build())).toBe(false);
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
      ['search query', (b: StateBuilder) => b.withSearchQuery('ninja')],
    ])('Rule: returns true when a %s filter is active', (_, setup) => {
      expect(selectHasActiveFilters(setup(stateBuilder()).build())).toBe(true);
    });
  });

  describe('selectSearchQuery', () => {
    test('Rule: returns the current search query', () => {
      expect(selectSearchQuery(stateBuilder().withSearchQuery('rhinar').build())).toBe('rhinar');
    });

    test('Rule: returns empty string when no query is set', () => {
      expect(selectSearchQuery(stateBuilder().build())).toBe('');
    });
  });

  describe('selectFilters', () => {
    test('Rule: returns the full filters state', () => {
      const result = selectFilters(
        stateBuilder()
          .withClasses([CARD_CLASSES.Generic])
          .withRarities([CARD_RARITIES.Marvel])
          .build(),
      );
      expect(result.classes).toEqual([CARD_CLASSES.Generic]);
      expect(result.rarities).toEqual([CARD_RARITIES.Marvel]);
    });
  });
});
