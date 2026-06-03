import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

export const selectFilters = (state: RootState) => state.filters;
export const selectSearchQuery = (state: RootState) => state.filters.searchQuery;
export const selectHasActiveFilters = createSelector(
  selectFilters,
  (f) =>
    f.classes.length > 0 ||
    f.talents.length > 0 ||
    f.types.length > 0 ||
    f.keywords.length > 0 ||
    f.sets.length > 0 ||
    f.rarities.length > 0 ||
    f.foilings.length > 0 ||
    f.searchQuery.length > 0,
);
