import type { RootState } from '@/domain/store';

export const selectAllCards = (state: RootState) => state.cardCatalog.allCards;
