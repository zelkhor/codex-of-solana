import { createSelector } from '@reduxjs/toolkit';
import type { CardDto, PrintingDto } from '@codex/shared';
import { SET_ORDER } from '@codex/shared';
import type { CardSetT } from '@codex/shared';
import type { RootState } from '@/store';
import { selectFilters } from '@/store/filters/filters.selectors';

export type GridSlot = {
  type: 'card';
  card: CardDto;
  printing: PrintingDto;
  backPrinting?: PrintingDto;
};

const selectAllCards = (state: RootState) => state.cardCatalog.allCards;
const selectSearchResults = (state: RootState) => state.cardCatalog.searchResults;

export const selectCardById = (cardIdentifier: string) => (state: RootState) =>
  selectAllCards(state).find((c) => c.cardIdentifier === cardIdentifier);

export const selectPrintingByCode = (printingCode: string) => (state: RootState) =>
  selectAllCards(state)
    .flatMap((c) => c.printings)
    .find((p) => p.print === printingCode);

export const selectPrintingByCardAndCode =
  (cardIdentifier: string, printingCode: string) => (state: RootState) => {
    const card = selectAllCards(state).find((c) => c.cardIdentifier === cardIdentifier);
    return card?.printings.find((p) => p.print === printingCode) ?? card?.printings[0];
  };

export const selectVisiblePrintings = createSelector(
  selectSearchResults,
  selectFilters,
  (cards, f) => {
    const filteredCards = cards.filter((card) => {
      if (!matchesMultiFilter(card.classes, f.classes)) return false;
      if (!matchesMultiFilter(card.talents, f.talents)) return false;
      if (!matchesMultiFilter(card.types, f.types)) return false;
      return matchesMultiFilter(card.keywords, f.keywords);
    });

    const matchesPrintingFilters = (p: PrintingDto) => {
      if (f.sets.length > 0 && !f.sets.includes(p.set)) return false;
      if (f.rarities.length > 0 && !f.rarities.includes(p.rarity)) return false;
      if (f.foilings.length > 0 && (!p.foiling || !f.foilings.includes(p.foiling))) return false;
      return true;
    };

    const slots: GridSlot[] = filteredCards.flatMap((card) =>
      card.printings
        .filter((p) => !p.print.includes('-Back'))
        .map((printing) => ({
          type: 'card' as const,
          card,
          printing,
          backPrinting: printing.backPrinting ?? undefined,
        }))
        .filter(
          ({ printing, backPrinting }) =>
            matchesPrintingFilters(printing) ||
            (backPrinting && matchesPrintingFilters(backPrinting)),
        ),
    );

    return sortSlots(slots);
  },
);

// ── Filter helpers ───────────────────────────────────────────────────────────

const matchesMultiFilter = (values: string[], filter: string[]): boolean => {
  if (filter.length === 0) return true;
  return filter.some((f) => values.includes(f));
};

// ── Sorting ──────────────────────────────────────────────────────────────────

const setIdx = (setName: CardSetT): number => {
  const idx = SET_ORDER.indexOf(setName);
  return idx === -1 ? Infinity : idx;
};

const sortSlots = (slots: GridSlot[]): GridSlot[] =>
  [...slots].sort((a, b) => {
    const idxDiff = setIdx(a.printing.set) - setIdx(b.printing.set);
    if (idxDiff !== 0) return idxDiff;
    return a.printing.identifier.localeCompare(b.printing.identifier);
  });
