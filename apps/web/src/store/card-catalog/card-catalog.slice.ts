import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CardDto } from '@codex/shared';
import { fetchAllCards } from '@/store/card-catalog/card-catalog.thunks';
import { ASYNC_STATUS, type AsyncStatusT } from '@/store/async-status';

export interface CardCatalogState {
  allCards: CardDto[];
  searchResults: CardDto[];
  status: AsyncStatusT;
  error: string | undefined;
}

const initialState: CardCatalogState = {
  allCards: [],
  searchResults: [],
  status: ASYNC_STATUS.Idle,
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
        state.status = ASYNC_STATUS.Loading;
        state.error = undefined;
      })
      .addCase(fetchAllCards.fulfilled, (state, action) => {
        state.allCards = action.payload;
        state.searchResults = action.payload;
        state.status = ASYNC_STATUS.Succeeded;
      })
      .addCase(fetchAllCards.rejected, (state, action) => {
        state.status = ASYNC_STATUS.Failed;
        state.error = action.payload ?? action.error.message ?? 'Failed to load cards';
      });
  },
});

export const { setSearchResults } = cardCatalogSlice.actions;
