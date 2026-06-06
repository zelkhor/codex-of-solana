import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Card } from '@codex/core';
import { ASYNC_STATUS, type AsyncStatusT } from '@/shared/types/async-status.ts';
import { getCards } from '@/domain/card-catalog/application/get-cards.thunk.ts';

export interface CardCatalogState {
  allCards: Card[];
  searchResults: Card[];
  status: AsyncStatusT;
  error: string | undefined;
}

const initialState: CardCatalogState = {
  allCards: [],
  searchResults: [],
  status: ASYNC_STATUS.IDLE,
  error: undefined,
};

export const cardCatalogSlice = createSlice({
  name: 'cardCatalog',
  initialState,
  reducers: {
    setSearchResults(state, action: PayloadAction<Card[]>) {
      state.searchResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCards.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
        state.error = undefined;
      })
      .addCase(getCards.fulfilled, (state, action) => {
        state.allCards = action.payload.allCards;
        state.searchResults = action.payload.searchResults;
        state.status = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(getCards.rejected, (state, action) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = action.payload ?? action.error.message ?? 'Failed to load cards';
      });
  },
});

export const { setSearchResults } = cardCatalogSlice.actions;
