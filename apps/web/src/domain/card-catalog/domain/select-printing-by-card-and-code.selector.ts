import type { RootState } from '@/shared/store';

import { selectAllCards } from '@/domain/card-catalog/domain/select-all-cards.selector.ts';

export const selectPrintingByCardAndCode =
  (cardIdentifier: string, printingCode: string) => (state: RootState) => {
    const card = selectAllCards(state).find((c) => c.cardIdentifier === cardIdentifier);
    return card?.printings.find((p) => p.print === printingCode) ?? card?.printings[0];
  };
