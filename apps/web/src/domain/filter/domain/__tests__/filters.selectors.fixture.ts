import { expect } from 'vitest';
import { createFixture } from '@/shared/store/__tests__/create-fixture.ts';
import type { StateBuilder } from '@/shared/store/__tests__/state.builder.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { type FiltersState } from '@/domain/filter/domain/filters.slice.ts';
import { selectSearchQuery } from '@/domain/filter/domain/select-search-query.selector.ts';
import { selectHasActiveFilters } from '@/domain/filter/domain/select-has-active-filters.selector.ts';

export const createFiltersSelectorsFixture = createFixture((stateBuilderProvider) => {
  const givenFilters = (setup: (b: StateBuilder) => StateBuilder) => {
    stateBuilderProvider.setState(setup);
  };

  const thenFiltersShouldBe = (expected: Partial<FiltersState>) => {
    expect(selectFilters(stateBuilderProvider.getState())).toMatchObject(expected);
  };

  const thenSearchQueryShouldBe = (expected: string) => {
    expect(selectSearchQuery(stateBuilderProvider.getState())).toBe(expected);
  };

  const thenShouldHaveActiveFilters = () => {
    expect(selectHasActiveFilters(stateBuilderProvider.getState())).toBe(true);
  };

  const thenShouldNotHaveAnyActiveFilters = () => {
    expect(selectHasActiveFilters(stateBuilderProvider.getState())).toBe(false);
  };

  return {
    givenFilters,
    thenFiltersShouldBe,
    thenSearchQueryShouldBe,
    thenShouldHaveActiveFilters,
    thenShouldNotHaveAnyActiveFilters,
  };
});

export type FiltersSelectorsFixture = ReturnType<typeof createFiltersSelectorsFixture>;
