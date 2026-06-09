import { selectAllCardsMap } from '@/domain/card-catalog/domain/select-cards-map.selector.ts';
import { type RootState } from '@/domain/store';

export const selectCardById = (cardIdentifier: string) => (state: RootState) =>
  selectAllCardsMap(state).get(cardIdentifier);
