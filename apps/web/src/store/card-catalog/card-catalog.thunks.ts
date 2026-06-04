import type { Card } from '@codex/core';
import type { AppThunk } from '@/store/app-thunk';
import { createAppAsyncThunk } from '@/store/app-thunk';
import { setSearchResults } from '@/store/card-catalog/card-catalog.slice';

export const fetchAllCards = createAppAsyncThunk<{ allCards: Card[]; searchResults: Card[] }, void>(
  'cardCatalog/fetchAllCards',
  async (_, { extra, rejectWithValue, getState }) => {
    const result = await extra.cardGateway.getAll();
    if (!result.ok) return rejectWithValue(result.error.message);
    extra.searchGateway.index(result.value);
    const { searchQuery } = getState().filters;
    const searchResults = searchQuery.trim()
      ? (extra.searchGateway.search(searchQuery) as Card[])
      : result.value;
    return { allCards: result.value, searchResults };
  },
);

export const searchCards =
  (query: string): AppThunk =>
  (dispatch, getState, extra) => {
    const allCards = getState().cardCatalog.allCards;
    if (!query.trim()) {
      dispatch(setSearchResults(allCards));
      return;
    }
    dispatch(setSearchResults(extra.searchGateway.search(query) as Card[]));
  };
