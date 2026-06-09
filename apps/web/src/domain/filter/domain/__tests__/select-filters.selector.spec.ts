import { beforeEach, describe, test } from 'vitest';

import { CLASSES, RARITIES } from '@codex/core';

import {
  type FiltersSelectorsFixture,
  createFiltersSelectorsFixture,
} from '@/domain/filter/domain/__tests__/filters.selectors.fixture.ts';
import { stateBuilderProvider } from '@/domain/store/__tests__/state.builder.ts';

describe('Feature: Getting filters', () => {
  let fixture: FiltersSelectorsFixture;

  beforeEach(() => {
    fixture = createFiltersSelectorsFixture(stateBuilderProvider());
  });

  test('Rule: Returns the full filter state', () => {
    fixture.givenFilters((b) => b.withClasses([CLASSES.Generic]).withRarities([RARITIES.Marvel]));
    fixture.thenFiltersShouldBe({
      classes: [CLASSES.Generic],
      rarities: [RARITIES.Marvel],
    });
  });
});
