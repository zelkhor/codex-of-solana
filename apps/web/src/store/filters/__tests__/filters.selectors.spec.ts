import { describe, test, expect } from 'vitest';
import {
  CARD_CLASSES,
  CARD_TALENTS,
  CARD_TYPES,
  CARD_KEYWORDS,
  CARD_SETS,
  CARD_RARITIES,
  CARD_FOILINGS,
} from '@codex/shared';
import { selectFilters, selectSearchQuery, selectHasActiveFilters } from '../filters.selectors';
import { stateBuilder, type StateBuilder } from '@/store/__tests__/state.builder';
import { createTestStore } from '@/store/__tests__/create-test-store';

describe('Feature: Filter selectors', () => {
  describe('selectHasActiveFilters', () => {
    test('Rule: returns false when no filters are active', () => {
      const store = createTestStore({}, stateBuilder().build());
      expect(selectHasActiveFilters(store.getState())).toBe(false);
    });

    test.each([
      ['class', (b: StateBuilder) => b.withClasses([CARD_CLASSES.Generic])],
      ['talent', (b: StateBuilder) => b.withTalents([CARD_TALENTS.Shadow])],
      ['type', (b: StateBuilder) => b.withTypes([CARD_TYPES.Action])],
      ['keyword', (b: StateBuilder) => b.withKeywords([CARD_KEYWORDS.Dominate])],
      ['set', (b: StateBuilder) => b.withSets([CARD_SETS.WelcomeToRathe])],
      ['rarity', (b: StateBuilder) => b.withRarities([CARD_RARITIES.Common])],
      ['foiling', (b: StateBuilder) => b.withFoilings([CARD_FOILINGS.Rainbow])],
      ['search query', (b: StateBuilder) => b.withSearchQuery('ninja')],
    ])('Rule: returns true when a %s filter is active', (_, setup) => {
      const store = createTestStore({}, setup(stateBuilder()).build());
      expect(selectHasActiveFilters(store.getState())).toBe(true);
    });
  });

  describe('selectSearchQuery', () => {
    test('Rule: returns the current search query', () => {
      const store = createTestStore({}, stateBuilder().withSearchQuery('rhinar').build());
      expect(selectSearchQuery(store.getState())).toBe('rhinar');
    });

    test('Rule: returns empty string when no query is set', () => {
      const store = createTestStore({}, stateBuilder().build());
      expect(selectSearchQuery(store.getState())).toBe('');
    });
  });

  describe('selectFilters', () => {
    test('Rule: returns the full filters state', () => {
      const store = createTestStore(
        {},
        stateBuilder()
          .withClasses([CARD_CLASSES.Generic])
          .withRarities([CARD_RARITIES.Marvel])
          .build(),
      );
      const result = selectFilters(store.getState());
      expect(result.classes).toEqual([CARD_CLASSES.Generic]);
      expect(result.rarities).toEqual([CARD_RARITIES.Marvel]);
    });
  });
});
