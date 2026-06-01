import { describe, test, expect } from 'vitest';
import { selectFilters, selectSearchQuery, selectHasActiveFilters } from '../filters.selectors';
import { stateBuilder, type StateBuilder } from '@/store/__tests__/state.builder';

describe('Feature: Filter selectors', () => {
  describe('selectHasActiveFilters', () => {
    test('Rule: returns false when no filters are active', () => {
      expect(selectHasActiveFilters(stateBuilder().build())).toBe(false);
    });

    test.each([
      ['classes', (b: StateBuilder) => b.withClasses(['Generic'])],
      ['talents', (b: StateBuilder) => b.withTalents(['Shadow'])],
      ['types', (b: StateBuilder) => b.withTypes(['Action'])],
      ['keywords', (b: StateBuilder) => b.withKeywords(['Dominate'])],
      ['sets', (b: StateBuilder) => b.withSets(['WTR'])],
      ['rarities', (b: StateBuilder) => b.withRarities(['Common'])],
      ['searchQuery', (b: StateBuilder) => b.withSearchQuery('ninja')],
    ])('Rule: returns true when %s filter is active', (_, setup) => {
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
      const state = stateBuilder().withClasses(['Generic']).withRarities(['Marvel']).build();
      const result = selectFilters(state);
      expect(result.classes).toEqual(['Generic']);
      expect(result.rarities).toEqual(['Marvel']);
    });
  });
});
