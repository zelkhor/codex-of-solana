import { type Card } from '@codex/core';

import { type RootState } from '@/domain/store';

export const selectCardsEntities = (state: RootState): Record<string, Card> =>
  state.cardCatalog.entities;
