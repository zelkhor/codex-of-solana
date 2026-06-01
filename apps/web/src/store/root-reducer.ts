import { combineReducers } from '@reduxjs/toolkit';
import { cardCatalogSlice } from '@/store/card-catalog/card-catalog.slice';
import { filtersSlice } from '@/store/filters/filters.slice';

export const rootReducer = combineReducers({
  cardCatalog: cardCatalogSlice.reducer,
  filters: filtersSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
