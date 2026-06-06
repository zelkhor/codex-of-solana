import type { RootState } from '@/shared/store';

export const selectAllCards = (state: RootState) => state.cardCatalog.allCards;
