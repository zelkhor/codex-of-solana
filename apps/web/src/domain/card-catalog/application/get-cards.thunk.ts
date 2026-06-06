import type { Card } from '@codex/core';
import { createAppAsyncThunk } from '@/shared/store/app-thunk.ts';

export const getCards = createAppAsyncThunk<{ allCards: Card[]; searchResults: Card[] }, void>(
  'cardCatalog/fetchAllCards',
  async (_, { extra, rejectWithValue, getState }) => {
    const result = await extra.cardCatalogGateway.getCards();
    if (!result.ok) return rejectWithValue(result.error.message);
    extra.searchGateway.index(result.value);
    const { searchQuery } = getState().filters;
    const searchResults = searchQuery.trim()
      ? (extra.searchGateway.search(searchQuery) as Card[])
      : result.value;
    return { allCards: result.value, searchResults };
  },
);
