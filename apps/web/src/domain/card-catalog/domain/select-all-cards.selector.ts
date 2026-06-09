import { createSelector } from '@reduxjs/toolkit';

import { type Card } from '@codex/core';

import { selectCardsEntities } from '@/domain/card-catalog/domain/select-cards-entities.selector.ts';
import { type RootState } from '@/domain/store';

const selectCardIds = (state: RootState) => state.cardCatalog.ids;

export const selectAllCards = createSelector(
  selectCardIds,
  selectCardsEntities,
  (ids, entities): Card[] => ids.map((id) => entities[id]),
);
