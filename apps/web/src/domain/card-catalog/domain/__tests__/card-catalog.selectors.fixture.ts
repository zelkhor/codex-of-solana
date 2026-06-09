import { expect } from 'vitest';

import type { Card, Printing } from '@codex/core';

import { selectAllArtists } from '@/domain/card-catalog/domain/select-all-artists.selector.ts';
import { selectCardById } from '@/domain/card-catalog/domain/select-card-by-id.selector.ts';
import { selectCardsEntities } from '@/domain/card-catalog/domain/select-cards-entities.selector.ts';
import { selectPrintingByCardAndCode } from '@/domain/card-catalog/domain/select-printing-by-card-and-code.selector.ts';
import { selectSearchResults } from '@/domain/card-catalog/domain/select-search-results.selector.ts';
import { createFixture } from '@/domain/store/__tests__/create-fixture.ts';

export const createCardCatalogSelectorsFixture = createFixture((stateBuilderProvider) => {
  const givenCards = (cards: Card[]) => {
    stateBuilderProvider.setState((b) => b.withAllCards(cards));
  };

  const givenSearchMatched = (identifiers: string[] | null) => {
    stateBuilderProvider.setState((b) => b.withSearchResultIdentifiers(identifiers));
  };

  const thenAllArtistsShouldBe = (expected: string[]) => {
    expect(selectAllArtists(stateBuilderProvider.getState())).toEqual(expected);
  };

  const thenCardsByIdentifierShouldBe = (expected: Record<string, Card>) => {
    expect(selectCardsEntities(stateBuilderProvider.getState())).toEqual(expected);
  };

  const thenSearchResultsShouldBe = (expected: Card[]) => {
    expect(selectSearchResults(stateBuilderProvider.getState())).toEqual(expected);
  };

  const thenCardByIdShouldBe = (cardIdentifier: string, expected: Card | undefined) => {
    expect(selectCardById(cardIdentifier)(stateBuilderProvider.getState())).toEqual(expected);
  };

  const thenPrintingByCardAndCodeShouldBe = (
    cardIdentifier: string,
    printingCode: string,
    expected: Printing | undefined,
  ) => {
    expect(
      selectPrintingByCardAndCode(cardIdentifier, printingCode)(stateBuilderProvider.getState()),
    ).toEqual(expected);
  };

  return {
    givenCards,
    givenSearchMatched,
    thenAllArtistsShouldBe,
    thenCardsByIdentifierShouldBe,
    thenSearchResultsShouldBe,
    thenCardByIdShouldBe,
    thenPrintingByCardAndCodeShouldBe,
  };
});

export type CardCatalogSelectorsFixture = ReturnType<typeof createCardCatalogSelectorsFixture>;
