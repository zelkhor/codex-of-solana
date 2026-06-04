import { createSelector } from '@reduxjs/toolkit';
import type { Card, Printing, CardSetT, CardFoilingT, CardRarityT } from '@codex/core';
import { SET_ORDER, FOILING_ORDER, RARITY_ORDER } from '@codex/core';
import type { RootState } from '@/store';
import { selectFilters } from '@/store/filters/filters.selectors';
import {
  COMPARISON_OPERATORS,
  SORT_ORDER,
  type NumericFilterT,
} from '@/store/filters/filters.slice';

const selectAllCards = (state: RootState) => state.cardCatalog.allCards;

const selectSearchResults = (state: RootState) => state.cardCatalog.searchResults;

export const selectCardById = (cardIdentifier: string) => (state: RootState) =>
  selectAllCards(state).find((c) => c.cardIdentifier === cardIdentifier);

export const selectPrintingByCardAndCode =
  (cardIdentifier: string, printingCode: string) => (state: RootState) => {
    const card = selectAllCards(state).find((c) => c.cardIdentifier === cardIdentifier);
    return card?.printings.find((p) => p.print === printingCode) ?? card?.printings[0];
  };

export const selectVisibleCards = createSelector(
  selectSearchResults,
  selectFilters,
  (cards, filters): Card[] => {
    const matchesPrintingFilters = (p: Printing): boolean => {
      if (filters.sets.length > 0 && !filters.sets.includes(p.set)) return false;
      if (filters.rarities.length > 0 && !filters.rarities.includes(p.rarity)) return false;
      if (filters.foilings.length > 0 && (!p.foiling || !filters.foilings.includes(p.foiling)))
        return false;
      return true;
    };

    return cards
      .filter((card) => {
        if (!matchesMultiFilter(card.classes, filters.classes)) return false;
        if (!matchesMultiFilter(card.talents, filters.talents)) return false;
        if (!matchesMultiFilter(card.types, filters.types)) return false;
        if (!matchesMultiFilter(card.subtypes, filters.subtypes)) return false;
        if (!matchesMultiFilter(card.keywords, filters.keywords)) return false;
        if (!matchesNumericFilter(card.cost, filters.cost)) return false;
        if (!matchesNumericFilter(card.pitch, filters.pitch)) return false;
        if (!matchesNumericFilter(card.attack, filters.attack)) return false;
        return matchesNumericFilter(card.defense, filters.defense);
      })
      .map((card) => {
        const printingOrBackFaceMatchesFilters = (p: Printing): boolean =>
          matchesPrintingFilters(p) ||
          (!filters.groupPrintings && !!p.backPrinting && matchesPrintingFilters(p.backPrinting));

        const filteredPrintings = card.printings
          .filter(isFrontPrinting)
          .filter(printingOrBackFaceMatchesFilters)
          .sort(compareBySetThenIdentifier);

        return {
          ...card,
          printings:
            filters.groupPrintings && filteredPrintings.length > 0
              ? [pickGroupedPrinting(filteredPrintings, filters.foilings, filters.rarities)]
              : filteredPrintings,
        };
      })
      .filter((card) => card.printings.length > 0);
  },
);

export type CardWithActivePrinting = {
  card: Card;
  printing: Printing;
  backPrinting?: Printing;
};

export const selectCardWithActivePrinting = createSelector(
  selectVisibleCards,
  selectFilters,
  (cards, filters): CardWithActivePrinting[] => {
    const result = cards.flatMap((card) =>
      card.printings.map((printing) => ({
        card,
        printing,
        backPrinting: printing.backPrinting ?? undefined,
      })),
    );

    if (filters.searchQuery.trim()) return result;

    switch (filters.sortOrder) {
      case SORT_ORDER.SET_ASC:
      case SORT_ORDER.SET_DESC: {
        const dir = filters.sortOrder === SORT_ORDER.SET_ASC ? 1 : -1;
        result.sort((a, b) => compareBySetThenIdentifier(a.printing, b.printing) * dir);
        break;
      }
      case SORT_ORDER.NAME_ASC:
      case SORT_ORDER.NAME_DESC: {
        const dir = filters.sortOrder === SORT_ORDER.NAME_ASC ? 1 : -1;
        result.sort((a, b) => a.card.name.localeCompare(b.card.name) * dir);
        break;
      }
    }

    return result;
  },
);

// ── Filter helpers ───────────────────────────────────────────────────────────

const isFrontPrinting = (p: Printing): boolean => !p.print.includes('-Back');

const matchesMultiFilter = (values: string[], filter: string[]): boolean => {
  if (filter.length === 0) return true;
  return filter.some((f) => values.includes(f));
};

const matchesNumericFilter = (cardValue: number | null, filter: NumericFilterT): boolean => {
  if (filter.value === null) return true;
  if (cardValue === null) return false;
  switch (filter.operator) {
    case COMPARISON_OPERATORS.GT:
      return cardValue > filter.value;
    case COMPARISON_OPERATORS.GTE:
      return cardValue >= filter.value;
    case COMPARISON_OPERATORS.EQ:
      return cardValue === filter.value;
    case COMPARISON_OPERATORS.LTE:
      return cardValue <= filter.value;
    case COMPARISON_OPERATORS.LT:
      return cardValue < filter.value;
    default:
      return true;
  }
};

// ── Sorting ──────────────────────────────────────────────────────────────────

const setIdx = (setName: CardSetT): number => {
  const idx = SET_ORDER.indexOf(setName);
  return idx === -1 ? Infinity : idx;
};

const compareBySetThenIdentifier = (a: Printing, b: Printing): number => {
  const diff = setIdx(a.set) - setIdx(b.set);
  return diff !== 0 ? diff : a.identifier.localeCompare(b.identifier);
};

// ── Grouping ─────────────────────────────────────────────────────────────────

const foilingIdx = (foiling: CardFoilingT): number => {
  const idx = FOILING_ORDER.indexOf(foiling);
  return idx === -1 ? Infinity : idx;
};

const rarityIdx = (rarity: CardRarityT): number => {
  const idx = RARITY_ORDER.indexOf(rarity);
  return idx === -1 ? Infinity : idx;
};

const pickGroupedPrinting = (
  printings: Printing[],
  foilings: CardFoilingT[],
  rarities: CardRarityT[],
): Printing =>
  [...printings].sort((a, b) => {
    if (foilings.length > 0) {
      const diff = foilingIdx(a.foiling) - foilingIdx(b.foiling);
      if (diff !== 0) return diff;
    }
    if (rarities.length > 0) {
      const diff = rarityIdx(a.rarity) - rarityIdx(b.rarity);
      if (diff !== 0) return diff;
    }
    return compareBySetThenIdentifier(a, b);
  })[0];
