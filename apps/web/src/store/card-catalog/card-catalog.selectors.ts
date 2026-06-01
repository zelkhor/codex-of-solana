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

const selectSearchResults = (state: RootState) => state.cardCatalog.searchResults;
const selectAllCards = (state: RootState) => state.cardCatalog.allCards;

// Index of image → printing built from ALL cards, used to resolve cross-card back sides
export const selectImageIndex = createSelector(selectAllCards, (allCards) => {
  const index = new Map<string, PrintingDto>();
  for (const card of allCards) {
    for (const printing of card.printings) {
      index.set(printing.image, printing);
    }
  }
  return index;
});

const selectCardLevelFiltered = createSelector(selectSearchResults, selectFilters, (cards, f) =>
  cards.filter((card) => {
    if (!matchesMultiFilter(card.classes, f.classes)) return false;
    if (!matchesMultiFilter(card.talents, f.talents)) return false;
    if (!matchesMultiFilter(card.types, f.types)) return false;
    return matchesMultiFilter(card.keywords, f.keywords);
  }),
);

export const selectGroupedGridSlots = createSelector(
  selectCardLevelFiltered,
  selectImageIndex,
  selectFilters,
  (filteredCards, imageIndex, f) => {
    const matchesPrintingFilters = (p: PrintingDto) => {
      if (f.sets.length > 0 && !f.sets.includes(p.set)) return false;
      return f.rarities.length === 0 || f.rarities.includes(p.rarity);
    };

    const slots: GridSlot[] = filteredCards.flatMap((card) =>
      card.printings
        .filter((p) => !p.print.includes('-Back'))
        .map((printing) => {
          const backPrinting = printing.oppositeImage
            ? imageIndex.get(printing.oppositeImage)
            : card.printings.find(
                (p) =>
                  p.identifier === printing.identifier &&
                  p.print.includes('-Back') &&
                  p.foiling === printing.foiling,
              );
          return { type: 'card' as const, card, printing, backPrinting };
        })
        .filter(
          ({ printing, backPrinting }) =>
            matchesPrintingFilters(printing) ||
            (backPrinting !== undefined && matchesPrintingFilters(backPrinting)),
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
