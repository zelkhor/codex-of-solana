import { type EntityState, type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { Card } from '@codex/core';

import { ASYNC_STATUS, type AsyncStatusT } from '@/shared/types/async-status.ts';

import { getCards } from '@/domain/card-catalog/application/get-cards.thunk.ts';
import { cardsAdapter } from '@/domain/card-catalog/domain/card.entity.ts';

export interface CardCatalogState extends EntityState<Card, string> {
  searchResultIdentifiers: string[] | null;
  status: AsyncStatusT;
  error: string | undefined;
}

const initialState: CardCatalogState = cardsAdapter.getInitialState({
  searchResultIdentifiers: null,
  status: ASYNC_STATUS.IDLE,
  error: undefined,
});

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
        cardsAdapter.setAll(state, action.payload);
        state.status = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(getCards.rejected, (state, action) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = action.payload ?? action.error.message ?? 'Failed to load cards';
      });
  },
});

export const { setSearchResultIdentifiers } = cardCatalogSlice.actions;
