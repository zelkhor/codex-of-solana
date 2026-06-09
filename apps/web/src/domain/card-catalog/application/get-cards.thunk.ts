import type { Card } from '@codex/core';

import { createAppAsyncThunk } from '@/domain/store/app-thunk.ts';

export const getCards = createAppAsyncThunk<
  { allCards: Card[]; searchResultIdentifiers: string[] | null },
  void
>('cardCatalog/fetchAllCards', async (_, { extra, rejectWithValue, getState }) => {
  const result = await extra.cardCatalogGateway.getCards();
  if (!result.ok) return rejectWithValue(result.error.message);
  extra.searchGateway.index(result.value);
  const { searchQuery } = getState().filters;
  const searchResultIdentifiers = searchQuery.trim()
    ? extra.searchGateway.search(searchQuery).map((card) => card.cardIdentifier)
    : null;
  return { allCards: result.value, searchResultIdentifiers };
});
