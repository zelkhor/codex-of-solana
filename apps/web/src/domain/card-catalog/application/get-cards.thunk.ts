import type { Card } from '@codex/core';

import { createAppAsyncThunk } from '@/domain/store/app-thunk.ts';

export const getCards = createAppAsyncThunk<Card[], void>(
  'cardCatalog/fetchAllCards',
  async (_, { extra, rejectWithValue }) => {
    const result = await extra.cardCatalogGateway.getCards();
    if (!result.ok) return rejectWithValue(result.error.message);
    extra.searchGateway.index(result.value);
    return result.value;
  },
);
