import { createSelector } from '@reduxjs/toolkit';

import { selectAllCards } from '@/domain/card-catalog/domain/select-all-cards.selector.ts';

export const selectAllArtists = createSelector(selectAllCards, (cards): string[] =>
  [...new Set(cards.flatMap((c) => c.printings.flatMap((p) => p.artists)))].sort(),
);
