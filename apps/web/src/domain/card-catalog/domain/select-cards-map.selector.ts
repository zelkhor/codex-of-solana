import { createSelector } from '@reduxjs/toolkit';
import { selectAllCards } from '@/domain/card-catalog/domain/select-all-cards.selector.ts';
import { type Card } from '@codex/core';

export const selectAllCardsMap = createSelector(
  selectAllCards,
  (cards): Map<string, Card> => new Map(cards.map((c) => [c.cardIdentifier, c])),
);
