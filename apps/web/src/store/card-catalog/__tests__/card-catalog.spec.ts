import { describe, test, expect } from 'vitest';
import { cardBuilder } from '@codex/shared';
import { InMemoryCardGateway } from '@/gateways/card.inmemory.gateway';
import { fetchAllCards, searchCards } from '@/store/card-catalog/card-catalog.thunks';
import { createTestStore } from '@/store/__tests__/create-test-store.ts';

describe('Feature: Loading cards', () => {
  test('Rule: It should load all printed cards', async () => {
    const card = cardBuilder().withCardIdentifier('card-a').build();
    const store = createTestStore({ cardGateway: new InMemoryCardGateway([card]) });

    await store.dispatch(fetchAllCards());

    expect(store.getState().cardCatalog.status).toBe('succeeded');
    expect(store.getState().cardCatalog.allCards).toHaveLength(1);
    expect(store.getState().cardCatalog.allCards[0].cardIdentifier).toBe('card-a');
  });

  test('Rule: It should report a failure when the cards could not be loaded', async () => {
    const store = createTestStore({
      cardGateway: new InMemoryCardGateway([], 'Network error'),
    });

    await store.dispatch(fetchAllCards());

    expect(store.getState().cardCatalog.status).toBe('failed');
    expect(store.getState().cardCatalog.error).toBe('Network error');
  });
});

describe('Feature: Searching cards', () => {
  test('Rule: It should show only cards matching the search query', async () => {
    const cards = [
      cardBuilder().withCardIdentifier('ninja-strike-red').withName('Ninja Strike').build(),
      cardBuilder().withCardIdentifier('brute-force-red').withName('Brute Force').build(),
    ];
    const store = createTestStore({ cardGateway: new InMemoryCardGateway(cards) });
    await store.dispatch(fetchAllCards());

    store.dispatch(searchCards('ninja'));

    expect(store.getState().cardCatalog.searchResults).toHaveLength(1);
    expect(store.getState().cardCatalog.searchResults[0].name).toBe('Ninja Strike');
  });

  test('Rule: It should restore the full catalog when the search is cleared', async () => {
    const cards = [
      cardBuilder().withCardIdentifier('card-a').withName('Alpha').build(),
      cardBuilder().withCardIdentifier('card-b').withName('Beta').build(),
    ];
    const store = createTestStore({ cardGateway: new InMemoryCardGateway(cards) });
    await store.dispatch(fetchAllCards());

    store.dispatch(searchCards('alpha'));
    expect(store.getState().cardCatalog.searchResults).toHaveLength(1);

    store.dispatch(searchCards(''));
    expect(store.getState().cardCatalog.searchResults).toHaveLength(2);
  });
});
