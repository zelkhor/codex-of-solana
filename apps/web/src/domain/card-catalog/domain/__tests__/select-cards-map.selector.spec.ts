import { describe, test, beforeEach } from 'vitest';
import { cardBuilder } from '@codex/core';
import { stateBuilderProvider } from '@/shared/store/__tests__/state.builder.ts';
import {
  createCardCatalogSelectorsFixture,
  type CardCatalogSelectorsFixture,
} from '@/domain/card-catalog/domain/__tests__/card-catalog.selectors.fixture.ts';

describe('Feature: Building the full card catalog map', () => {
  let fixture: CardCatalogSelectorsFixture;

  beforeEach(() => {
    fixture = createCardCatalogSelectorsFixture(stateBuilderProvider());
  });

  test('Rule: Returns an empty map when no cards are loaded', () => {
    fixture.givenCards([]);
    fixture.thenCardsMapShouldBe(new Map());
  });

  test('Rule: Contains an entry for each card keyed by identifier', () => {
    const cardA = cardBuilder().withCardIdentifier('card-a').build();
    const cardB = cardBuilder().withCardIdentifier('card-b').build();
    fixture.givenCards([cardA, cardB]);

    fixture.thenCardsMapShouldBe(
      new Map([
        ['card-a', cardA],
        ['card-b', cardB],
      ]),
    );
  });
});
