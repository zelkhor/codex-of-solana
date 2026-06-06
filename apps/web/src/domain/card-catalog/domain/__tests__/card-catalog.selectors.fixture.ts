import { createFixture } from '@/shared/store/__tests__/create-fixture.ts';
import type { Card, Printing } from '@codex/core';
import { expect } from 'vitest';
import { selectAllArtists } from '@/domain/card-catalog/domain/select-all-artists.selector.ts';
import { selectAllCardsMap } from '@/domain/card-catalog/domain/select-cards-map.selector.ts';
import { selectCardById } from '@/domain/card-catalog/domain/select-card-by-id.selector.ts';
import { selectPrintingByCardAndCode } from '@/domain/card-catalog/domain/select-printing-by-card-and-code.selector.ts';

export const createCardCatalogSelectorsFixture = createFixture((stateBuilderProvider) => {
  const givenCards = (cards: Card[]) => {
    stateBuilderProvider.setState((b) => b.withAllCards(cards));
  };

  const thenAllArtistsShouldBe = (expected: string[]) => {
    expect(selectAllArtists(stateBuilderProvider.getState())).toEqual(expected);
  };

  const thenCardsMapShouldBe = (expected: Map<string, Card>) => {
    expect(selectAllCardsMap(stateBuilderProvider.getState())).toEqual(expected);
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
    thenAllArtistsShouldBe,
    thenCardsMapShouldBe,
    thenCardByIdShouldBe,
    thenPrintingByCardAndCodeShouldBe,
  };
});

export type CardCatalogSelectorsFixture = ReturnType<typeof createCardCatalogSelectorsFixture>;
