import { selectCardsEntities } from '@/domain/card-catalog/domain/select-cards-entities.selector.ts';
import type { RootState } from '@/domain/store';

export const selectPrintingByCardAndCode =
  (cardIdentifier: string, printingCode: string) => (state: RootState) => {
    const card = selectCardsEntities(state)[cardIdentifier];
    return card?.printings.find((p) => p.print === printingCode) ?? card?.printings[0];
  };
