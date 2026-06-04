import { createFixture } from '@/store/__tests__/create-fixture';
import { createTestStore, type AppTestStore } from '@/store/__tests__/create-test-store.ts';
import type { StateBuilder } from '@/store/__tests__/state.builder';

import {
  setClasses,
  setTalents,
  setTypes,
  setSubtypes,
  setKeywords,
  setSets,
  setRarities,
  setFoilings,
  setArtists,
  resetFilters,
  type FiltersState,
} from '../filters.slice';
import { selectFilters, selectHasActiveFilters } from '../filters.selectors';
import { expect } from 'vitest';
import type {
  CardClassT,
  CardFoilingT,
  CardKeywordT,
  CardRarityT,
  CardSetT,
  CardSubtypeT,
  CardTalentT,
  CardTypeT,
} from '@codex/core';

export const createFiltersFixture = createFixture((stateBuilder) => {
  let store: AppTestStore;

  const givenActiveFilters = (setup: (b: StateBuilder) => StateBuilder) => {
    stateBuilder.setState(setup);
  };

  const initStore = () => {
    store = createTestStore({}, stateBuilder.getState());
  };

  const whenAddingClassFilter = (classes: CardClassT[]) => {
    initStore();
    store.dispatch(setClasses(classes));
  };

  const whenAddingTalentFilter = (talents: CardTalentT[]) => {
    initStore();
    store.dispatch(setTalents(talents));
  };

  const whenAddingTypeFilter = (types: CardTypeT[]) => {
    initStore();
    store.dispatch(setTypes(types));
  };

  const whenAddingSubtypeFilter = (subtypes: CardSubtypeT[]) => {
    initStore();
    store.dispatch(setSubtypes(subtypes));
  };

  const whenAddingKeywordFilter = (keywords: CardKeywordT[]) => {
    initStore();
    store.dispatch(setKeywords(keywords));
  };

  const whenAddingSetFilter = (sets: CardSetT[]) => {
    initStore();
    store.dispatch(setSets(sets));
  };

  const whenAddingRarityFilter = (rarities: CardRarityT[]) => {
    initStore();
    store.dispatch(setRarities(rarities));
  };

  const whenAddingFoilingFilter = (foilings: CardFoilingT[]) => {
    initStore();
    store.dispatch(setFoilings(foilings));
  };

  const whenAddingArtistFilter = (artists: string[]) => {
    initStore();
    store.dispatch(setArtists(artists));
  };

  const whenResettingFilters = () => {
    initStore();
    store.dispatch(resetFilters());
  };

  const thenFiltersShouldBe = (expected: Partial<FiltersState>) => {
    expect(selectFilters(store.getState())).toMatchObject(expected);
  };

  const thenHasActiveFiltersShouldBe = (expected: boolean) => {
    expect(selectHasActiveFilters(store.getState())).toBe(expected);
  };

  return {
    givenActiveFilters,
    whenAddingClassFilter,
    whenAddingTalentFilter,
    whenAddingTypeFilter,
    whenAddingSubtypeFilter,
    whenAddingKeywordFilter,
    whenAddingSetFilter,
    whenAddingRarityFilter,
    whenAddingFoilingFilter,
    whenAddingArtistFilter,
    whenResettingFilters,
    thenFiltersShouldBe,
    thenHasActiveFiltersShouldBe,
  };
});

export type FiltersFixture = ReturnType<typeof createFiltersFixture>;
