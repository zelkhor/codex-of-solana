import { describe, test, beforeEach } from 'vitest';
import { stateBuilderProvider } from '@/shared/store/__tests__/state.builder.ts';
import { CARD_CLASSES, CARD_RARITIES } from '@codex/core';
import {
  createFiltersSelectorsFixture,
  type FiltersSelectorsFixture,
} from '@/domain/filter/domain/__tests__/filters.selectors.fixture.ts';

describe('Feature: Getting filters', () => {
  let fixture: FiltersSelectorsFixture;

  beforeEach(() => {
    fixture = createFiltersSelectorsFixture(stateBuilderProvider());
  });

  test('Rule: Returns the full filter state', () => {
    fixture.givenFilters((b) =>
      b.withClasses([CARD_CLASSES.Generic]).withRarities([CARD_RARITIES.Marvel]),
    );
    fixture.thenFiltersShouldBe({
      classes: [CARD_CLASSES.Generic],
      rarities: [CARD_RARITIES.Marvel],
    });
  });
});
