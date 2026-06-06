import { createSelector } from '@reduxjs/toolkit';

import { type Card } from '@codex/core';

import { selectAllCards } from '@/domain/card-catalog/domain/select-all-cards.selector.ts';

export const selectAllCardsMap = createSelector(
  selectAllCards,
  (cards): Map<string, Card> => new Map(cards.map((c) => [c.cardIdentifier, c])),
);
