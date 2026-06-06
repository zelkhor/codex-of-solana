import { type RootState } from '@/shared/store';

import { selectAllCards } from '@/domain/card-catalog/domain/select-all-cards.selector.ts';

export const selectCardById = (cardIdentifier: string) => (state: RootState) =>
  selectAllCards(state).find((c) => c.cardIdentifier === cardIdentifier);
