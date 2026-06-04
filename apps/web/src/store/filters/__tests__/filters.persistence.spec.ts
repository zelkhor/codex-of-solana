import { describe, test, expect, beforeEach, vi } from 'vitest';
import { FILTERS_STORAGE_KEY, loadFilters, saveFilters } from '../filters.persistence';
import type { FiltersState } from '../filters.slice';
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
import { COMPARISON_OPERATORS, SORT_ORDER } from '../filters.slice';

const fullState: FiltersState = {
  classes: [CARD_CLASSES.Ninja],
  talents: [CARD_TALENTS.Draconic],
  types: [CARD_TYPES.Action],
  subtypes: [CARD_SUBTYPES.Attack],
  keywords: [CARD_KEYWORDS.Amp],
  sets: [CARD_SETS.WelcomeToRathe],
  rarities: [CARD_RARITIES.Promo],
  foilings: [CARD_FOILINGS.Gold],
  searchQuery: 'ninja',
  sortOrder: SORT_ORDER.SET_ASC,
  cost: { operator: COMPARISON_OPERATORS.GTE, value: 2 },
  pitch: { operator: COMPARISON_OPERATORS.EQ, value: 1 },
  attack: { operator: COMPARISON_OPERATORS.GT, value: 3 },
  defense: { operator: COMPARISON_OPERATORS.LTE, value: 4 },
};

describe('Feature: Loading persisted filters from local storage', () => {
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

describe('Feature: Saving filters to local storage', () => {
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
