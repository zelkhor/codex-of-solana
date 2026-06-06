import { combineReducers } from '@reduxjs/toolkit';
import { cardCatalogSlice } from '@/domain/card-catalog/domain/card-catalog.slice.ts';
import { filtersSlice } from '@/domain/filter/domain/filters.slice.ts';

export const rootReducer = combineReducers({
  cardCatalog: cardCatalogSlice.reducer,
  filters: filtersSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
