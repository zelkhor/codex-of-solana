import { describe, test, beforeEach } from 'vitest';
import { cardBuilder } from '@codex/core';
import { stateBuilderProvider } from '@/shared/store/__tests__/state.builder.ts';
import {
  createCardCatalogSelectorsFixture,
  type CardCatalogSelectorsFixture,
} from '@/domain/card-catalog/domain/__tests__/card-catalog.selectors.fixture.ts';

describe('Feature: Looking up a card by identifier', () => {
  let fixture: CardCatalogSelectorsFixture;

  beforeEach(() => {
    fixture = createCardCatalogSelectorsFixture(stateBuilderProvider());
  });

  test('Rule: Returns the card when it exists in the catalog', () => {
    const card = cardBuilder().withCardIdentifier('ninja-strike-red').build();
    fixture.givenCards([card]);
    fixture.thenCardByIdShouldBe('ninja-strike-red', card);
  });

  test('Rule: Returns undefined when no card matches the identifier', () => {
    fixture.givenCards([]);
    fixture.thenCardByIdShouldBe('non-existent', undefined);
  });
});
