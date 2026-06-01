import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CardDto } from '@codex/shared';
import { fetchAllCards } from '@/store/card-catalog/card-catalog.thunks';

export interface CardCatalogState {
  allCards: CardDto[];
  searchResults: CardDto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
}

const initialState: CardCatalogState = {
  allCards: [],
  searchResults: [],
  status: 'idle',
  error: undefined,
};

export const cardCatalogSlice = createSlice({
  name: 'cardCatalog',
  initialState,
  reducers: {
    setSearchResults(state, action: PayloadAction<CardDto[]>) {
      state.searchResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCards.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchAllCards.fulfilled, (state, action) => {
        state.allCards = action.payload;
        state.searchResults = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAllCards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Failed to load cards';
      });
  },
});

export const { setSearchResults } = cardCatalogSlice.actions;
