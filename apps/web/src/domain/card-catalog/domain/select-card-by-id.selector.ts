import { type Card } from '@codex/core';

import { selectCardsEntities } from '@/domain/card-catalog/domain/select-cards-entities.selector.ts';
import { type RootState } from '@/domain/store';

export const selectCardById =
  (cardIdentifier: string) =>
  (state: RootState): Card | undefined =>
    selectCardsEntities(state)[cardIdentifier];
