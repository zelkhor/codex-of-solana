import { createSelector } from '@reduxjs/toolkit';

import type { Card } from '@codex/core';

import { selectAllCards } from '@/domain/card-catalog/domain/select-all-cards.selector.ts';
import { selectAllCardsMap } from '@/domain/card-catalog/domain/select-cards-map.selector.ts';
import { type RootState } from '@/domain/store';

const selectSearchResultIdentifiers = (state: RootState) =>
  state.cardCatalog.searchResultIdentifiers;

export const selectSearchResults = createSelector(
  selectAllCards,
  selectSearchResultIdentifiers,
  selectAllCardsMap,
  (allCards, searchResultIds, cardsMap): Card[] =>
    searchResultIds === null
      ? allCards
      : searchResultIds
          .map((identifier) => cardsMap.get(identifier))
          .filter((card): card is Card => card !== undefined),
);
