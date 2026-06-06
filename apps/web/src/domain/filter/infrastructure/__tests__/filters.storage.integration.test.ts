import { beforeEach, describe, expect, test, vi } from 'vitest';

import { CLASSES, FOILINGS, KEYWORDS, RARITIES, SETS, SUBTYPES, TALENTS, TYPES } from '@codex/core';

import { stateBuilder } from '@/shared/store/__tests__/state.builder.ts';
import { COMPARISON_OPERATORS } from '@/shared/types/comparison-operator.ts';
import { FILTER_MODES } from '@/shared/types/filter-mode.ts';
import { SORT_ORDER } from '@/shared/types/sort-order.ts';

import {
  FILTERS_STORAGE_KEY,
  loadFilters,
  saveFilters,
} from '@/domain/filter/infrastructure/filters.storage.ts';

const fullState = stateBuilder()
  .withClasses([CLASSES.Ninja])
  .withClassFilterMode(FILTER_MODES.ANY)
  .withTalents([TALENTS.Draconic])
  .withTalentFilterMode(FILTER_MODES.ANY)
  .withTypes([TYPES.Action])
  .withTypeFilterMode(FILTER_MODES.ANY)
  .withSubtypes([SUBTYPES.Attack])
  .withSubtypeFilterMode(FILTER_MODES.ANY)
  .withKeywords([KEYWORDS.Amp])
  .withKeywordFilterMode(FILTER_MODES.ANY)
  .withSets([SETS.WelcomeToRathe])
  .withRarities([RARITIES.Promo])
  .withFoilings([FOILINGS.Gold])
  .withArtists(['Micah Epstein'])
  .withSearchQuery('ninja')
  .withSortOrder(SORT_ORDER.SET_ASC)
  .withCostFilter({ operator: COMPARISON_OPERATORS.GTE, value: 2 })
  .withPitchFilter({ operator: COMPARISON_OPERATORS.EQ, value: 1 })
  .withAttackFilter({ operator: COMPARISON_OPERATORS.GT, value: 3 })
  .withDefenseFilter({ operator: COMPARISON_OPERATORS.LTE, value: 4 })
  .withGroupPrintings(true)
  .build().filters;

describe('Integration: Loading persisted filters from local storage', () => {
  beforeEach(() => localStorage.clear());

  test('Rule: returns undefined when nothing is stored', () => {
    expect(loadFilters()).toBeUndefined();
  });

  test('Rule: returns undefined when stored value is not valid JSON and clear local storage', () => {
    localStorage.setItem(FILTERS_STORAGE_KEY, 'not-json{{');
    expect(loadFilters()).toBeUndefined();
    expect(localStorage.getItem(FILTERS_STORAGE_KEY)).toBeNull();
  });

  test('Rule: returns parsed state when stored value is valid', () => {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(fullState));
    expect(loadFilters()).toEqual(fullState);
  });
});

describe('Integration: Saving filters to local storage', () => {
  beforeEach(() => localStorage.clear());

  test('Rule: writes the correct JSON string to localStorage', () => {
    saveFilters(fullState);
    expect(localStorage.getItem(FILTERS_STORAGE_KEY)).toBe(JSON.stringify(fullState));
  });

  test('Rule: Does not throw and clear local storage when error occurs', () => {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(fullState));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => saveFilters(fullState)).not.toThrow();
    expect(localStorage.getItem(FILTERS_STORAGE_KEY)).toBeNull();
  });
});
