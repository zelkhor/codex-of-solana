import type { Card } from '@codex/core';
import type { AppThunk } from '@/store/app-thunk';
import { createAppAsyncThunk } from '@/store/app-thunk';
import { setSearchResults } from '@/store/card-catalog/card-catalog.slice';

export const fetchAllCards = createAppAsyncThunk<Card[], void>(
  'cardCatalog/fetchAllCards',
  async (_, { extra, rejectWithValue }) => {
    const result = await extra.cardGateway.getAll();
    if (!result.ok) return rejectWithValue(result.error.message);
    extra.searchGateway.index(result.value);
    return result.value;
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
