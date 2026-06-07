import { createSelector } from '@reduxjs/toolkit';

import { FILTER_MODES } from '@/shared/types/filter-mode.ts';

import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const selectHasActiveFilters = createSelector(
  selectFilters,
  (f) =>
    f.classes.length > 0 ||
    f.classFilterMode === FILTER_MODES.EXACT ||
    f.talents.length > 0 ||
    f.talentFilterMode === FILTER_MODES.EXACT ||
    f.types.length > 0 ||
    f.typeFilterMode === FILTER_MODES.EXACT ||
    f.subtypes.length > 0 ||
    f.subtypeFilterMode === FILTER_MODES.EXACT ||
    f.keywords.length > 0 ||
    f.keywordFilterMode === FILTER_MODES.EXACT ||
    f.sets.length > 0 ||
    f.rarities.length > 0 ||
    f.foilings.length > 0 ||
    f.artists.length > 0 ||
    f.hero !== null ||
    f.searchQuery.length > 0,
);
