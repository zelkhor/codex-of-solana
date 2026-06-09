import { selectAllCardsMap } from '@/domain/card-catalog/domain/select-cards-map.selector.ts';
import type { RootState } from '@/domain/store';

export const selectPrintingByCardAndCode =
  (cardIdentifier: string, printingCode: string) => (state: RootState) => {
    const card = selectAllCardsMap(state).get(cardIdentifier);
    return card?.printings.find((p) => p.print === printingCode) ?? card?.printings[0];
  };
