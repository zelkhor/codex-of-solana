import { createSelector } from '@reduxjs/toolkit';

import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const selectHasActiveFilters = createSelector(
  selectFilters,
  (f) =>
    f.classes.length > 0 ||
    f.talents.length > 0 ||
    f.types.length > 0 ||
    f.subtypes.length > 0 ||
    f.keywords.length > 0 ||
    f.sets.length > 0 ||
    f.rarities.length > 0 ||
    f.foilings.length > 0 ||
    f.artists.length > 0 ||
    f.searchQuery.length > 0,
);
