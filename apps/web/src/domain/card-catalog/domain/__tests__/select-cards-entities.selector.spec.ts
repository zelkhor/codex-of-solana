import { beforeEach, describe, test } from 'vitest';

import { cardBuilder } from '@codex/core/testing';

import {
  type CardCatalogSelectorsFixture,
  createCardCatalogSelectorsFixture,
} from '@/domain/card-catalog/domain/__tests__/card-catalog.selectors.fixture.ts';
import { stateBuilderProvider } from '@/domain/store/__tests__/state.builder.ts';

describe('Feature: Looking up loaded cards by their identifier', () => {
  let fixture: CardCatalogSelectorsFixture;

  beforeEach(() => {
    fixture = createCardCatalogSelectorsFixture(stateBuilderProvider());
  });

  test('Rule: There is nothing to look up when no cards are loaded', () => {
    fixture.givenCards([]);
    fixture.thenCardsByIdentifierShouldBe({});
  });

  test('Rule: Every loaded card can be found by its identifier', () => {
    const cardA = cardBuilder().withCardIdentifier('card-a').build();
    const cardB = cardBuilder().withCardIdentifier('card-b').build();
    fixture.givenCards([cardA, cardB]);

    fixture.thenCardsByIdentifierShouldBe({
      'card-a': cardA,
      'card-b': cardB,
    });
  });
});
