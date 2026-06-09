import { createSelector } from '@reduxjs/toolkit';

import type { Card } from '@codex/core';

import { selectAllCards } from '@/domain/card-catalog/domain/select-all-cards.selector.ts';
import { selectCardsEntities } from '@/domain/card-catalog/domain/select-cards-entities.selector.ts';
import { type RootState } from '@/domain/store';

const selectSearchResultIdentifiers = (state: RootState) =>
  state.cardCatalog.searchResultIdentifiers;

export const selectSearchResults = createSelector(
  selectAllCards,
  selectSearchResultIdentifiers,
  selectCardsEntities,
  (allCards, searchResultIds, entities): Card[] =>
    searchResultIds === null
      ? allCards
      : searchResultIds
          .map((identifier) => entities[identifier])
          .filter((card): card is Card => card !== undefined),
);
