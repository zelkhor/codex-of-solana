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

import { createFixture } from '@/shared/store/__tests__/create-fixture.ts';
import { type AppTestStore, createTestStore } from '@/shared/store/__tests__/create-test-store.ts';
import type { StateBuilder } from '@/shared/store/__tests__/state.builder.ts';

import {
  type FiltersState,
  resetFilters,
  setArtists,
  setClasses,
  setExcludeCardsWithTalent,
  setFoilings,
  setKeywords,
  setRarities,
  setSets,
  setSubtypes,
  setTalents,
  setTypes,
} from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { selectHasActiveFilters } from '@/domain/filter/domain/select-has-active-filters.selector.ts';

export const createFiltersSliceFixture = createFixture((stateBuilderProvider) => {
  let store: AppTestStore;

  const givenActiveFilters = (setup: (b: StateBuilder) => StateBuilder) => {
    stateBuilderProvider.setState(setup);
  };

  const initStore = () => {
    store = createTestStore({}, stateBuilderProvider.getState());
  };

  const whenAddingClassFilter = (classes: CardClassT[]) => {
    initStore();
    store.dispatch(setClasses(classes));
  };

  const whenAddingTalentFilter = (talents: CardTalentT[]) => {
    initStore();
    store.dispatch(setTalents(talents));
  };

  const whenSettingExcludeCardsWithTalent = (exclude: boolean) => {
    initStore();
    store.dispatch(setExcludeCardsWithTalent(exclude));
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
    whenSettingExcludeCardsWithTalent,
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

export type FiltersSliceFixture = ReturnType<typeof createFiltersSliceFixture>;
