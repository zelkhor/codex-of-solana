import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { Card } from '@codex/core';

import { ASYNC_STATUS, type AsyncStatusT } from '@/shared/types/async-status.ts';

import { getCards } from '@/domain/card-catalog/application/get-cards.thunk.ts';

export interface CardCatalogState {
  allCards: Card[];
  searchResultIdentifiers: string[] | null;
  status: AsyncStatusT;
  error: string | undefined;
}

const initialState: CardCatalogState = {
  allCards: [],
  searchResultIdentifiers: null,
  status: ASYNC_STATUS.IDLE,
  error: undefined,
};

export const cardCatalogSlice = createSlice({
  name: 'cardCatalog',
  initialState,
  reducers: {
    setSearchResultIdentifiers(state, action: PayloadAction<string[] | null>) {
      state.searchResultIdentifiers = action.payload;
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
        state.searchResultIdentifiers = action.payload.searchResultIdentifiers;
        state.status = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(getCards.rejected, (state, action) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = action.payload ?? action.error.message ?? 'Failed to load cards';
      });
  },
});

export const { setSearchResultIdentifiers } = cardCatalogSlice.actions;
