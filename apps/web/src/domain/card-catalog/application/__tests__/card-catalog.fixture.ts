import type { Card } from '@codex/core';
import { expect } from 'vitest';
import { InMemoryCardCatalogGateway } from '@/domain/card-catalog/infrastructure/card-catalog.inmemory.gateway.ts';
import { createTestStore, type AppTestStore } from '@/shared/store/__tests__/create-test-store.ts';
import { getCards } from '@/domain/card-catalog/application/get-cards.thunk.ts';
import { searchCards } from '@/domain/card-catalog/application/search-cards.thunk.ts';

export const createCardCatalogFixture = () => {
  let store: AppTestStore;
  const cardCatalogGateway = new InMemoryCardCatalogGateway();

  const givenAvailableCards = (cards: Card[]) => {
    cardCatalogGateway.setCards(cards);
  };

  const givenGatewayFails = (errorMessage: string) => {
    cardCatalogGateway.simulateError(errorMessage);
  };

  const whenGettingCards = async () => {
    store = createTestStore({ cardCatalogGateway: cardCatalogGateway });
    await store.dispatch(getCards());
  };

  const whenSearchingCards = (query: string) => {
    store.dispatch(searchCards(query));
  };

  const thenCardsShouldBe = (expected: Card[]) => {
    expect(store.getState().cardCatalog.allCards).toEqual(expected);
  };

  const thenStatusShouldBe = (expected: string) => {
    expect(store.getState().cardCatalog.status).toBe(expected);
  };

  const thenErrorShouldBe = (expected: string) => {
    expect(store.getState().cardCatalog.error).toBe(expected);
  };

  const thenSearchResultsShouldBe = (expected: Card[]) => {
    expect(store.getState().cardCatalog.searchResults).toEqual(expected);
  };

  return {
    givenAvailableCards,
    givenGatewayFails,
    whenGettingCards,
    whenSearchingCards,
    thenCardsShouldBe,
    thenStatusShouldBe,
    thenErrorShouldBe,
    thenSearchResultsShouldBe,
  };
};

export type CardCatalogFixture = ReturnType<typeof createCardCatalogFixture>;
