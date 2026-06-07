import { expect } from 'vitest';

import type {
  ClassT,
  FoilingT,
  HeroT,
  KeywordT,
  RarityT,
  SetT,
  SubtypeT,
  TalentT,
  TreatmentT,
  TypeT,
} from '@codex/core';

import { createFixture } from '@/shared/store/__tests__/create-fixture.ts';
import { type AppTestStore, createTestStore } from '@/shared/store/__tests__/create-test-store.ts';
import type { StateBuilder } from '@/shared/store/__tests__/state.builder.ts';
import type { FilterModeT } from '@/shared/types/filter-mode.ts';

import {
  type FiltersState,
  resetFilters,
  setArtists,
  setClassFilterMode,
  setClasses,
  setFoilings,
  setHero,
  setKeywordFilterMode,
  setKeywords,
  setRarities,
  setSets,
  setSubtypeFilterMode,
  setSubtypes,
  setTalentFilterMode,
  setTalents,
  setTreatmentFilterMode,
  setTreatments,
  setTypeFilterMode,
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

  const whenAddingClassFilter = (classes: ClassT[]) => {
    initStore();
    store.dispatch(setClasses(classes));
  };

  const whenSettingClassFilterMode = (mode: FilterModeT) => {
    initStore();
    store.dispatch(setClassFilterMode(mode));
  };

  const whenAddingTalentFilter = (talents: TalentT[]) => {
    initStore();
    store.dispatch(setTalents(talents));
  };

  const whenSettingTalentFilterMode = (mode: FilterModeT) => {
    initStore();
    store.dispatch(setTalentFilterMode(mode));
  };

  const whenAddingTypeFilter = (types: TypeT[]) => {
    initStore();
    store.dispatch(setTypes(types));
  };

  const whenSettingTypeFilterMode = (mode: FilterModeT) => {
    initStore();
    store.dispatch(setTypeFilterMode(mode));
  };

  const whenAddingSubtypeFilter = (subtypes: SubtypeT[]) => {
    initStore();
    store.dispatch(setSubtypes(subtypes));
  };

  const whenSettingSubtypeFilterMode = (mode: FilterModeT) => {
    initStore();
    store.dispatch(setSubtypeFilterMode(mode));
  };

  const whenAddingKeywordFilter = (keywords: KeywordT[]) => {
    initStore();
    store.dispatch(setKeywords(keywords));
  };

  const whenSettingKeywordFilterMode = (mode: FilterModeT) => {
    initStore();
    store.dispatch(setKeywordFilterMode(mode));
  };

  const whenAddingSetFilter = (sets: SetT[]) => {
    initStore();
    store.dispatch(setSets(sets));
  };

  const whenAddingRarityFilter = (rarities: RarityT[]) => {
    initStore();
    store.dispatch(setRarities(rarities));
  };

  const whenAddingFoilingFilter = (foilings: FoilingT[]) => {
    initStore();
    store.dispatch(setFoilings(foilings));
  };

  const whenAddingTreatmentFilter = (treatments: TreatmentT[]) => {
    initStore();
    store.dispatch(setTreatments(treatments));
  };

  const whenSettingTreatmentFilterMode = (mode: FilterModeT) => {
    initStore();
    store.dispatch(setTreatmentFilterMode(mode));
  };

  const whenAddingArtistFilter = (artists: string[]) => {
    initStore();
    store.dispatch(setArtists(artists));
  };

  const whenSelectingHeroFilter = (hero: HeroT | null) => {
    initStore();
    store.dispatch(setHero(hero));
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
    whenSettingClassFilterMode,
    whenAddingTalentFilter,
    whenSettingTalentFilterMode,
    whenAddingTypeFilter,
    whenSettingTypeFilterMode,
    whenAddingSubtypeFilter,
    whenSettingSubtypeFilterMode,
    whenAddingKeywordFilter,
    whenSettingKeywordFilterMode,
    whenAddingSetFilter,
    whenAddingRarityFilter,
    whenAddingFoilingFilter,
    whenAddingTreatmentFilter,
    whenSettingTreatmentFilterMode,
    whenAddingArtistFilter,
    whenSelectingHeroFilter,
    whenResettingFilters,
    thenFiltersShouldBe,
    thenHasActiveFiltersShouldBe,
  };
});

export type FiltersSliceFixture = ReturnType<typeof createFiltersSliceFixture>;
