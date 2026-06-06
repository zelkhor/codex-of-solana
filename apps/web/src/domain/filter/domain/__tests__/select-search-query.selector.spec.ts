import { beforeEach, describe, test } from 'vitest';

import { stateBuilderProvider } from '@/shared/store/__tests__/state.builder.ts';

import {
  type FiltersSelectorsFixture,
  createFiltersSelectorsFixture,
} from '@/domain/filter/domain/__tests__/filters.selectors.fixture.ts';

describe('Feature: Reading the current search query', () => {
  let fixture: FiltersSelectorsFixture;

  beforeEach(() => {
    const stateBuilder = stateBuilderProvider();
    fixture = createFiltersSelectorsFixture(stateBuilder);
  });

  test('Rule: Returns the current search query', () => {
    fixture.givenFilters((b) => b.withSearchQuery('rhinar'));
    fixture.thenSearchQueryShouldBe('rhinar');
  });

  test('Rule: Returns an empty string when no query is set', () => {
    fixture.thenSearchQueryShouldBe('');
  });
});
