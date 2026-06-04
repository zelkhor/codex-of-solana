import { createSelector } from '@reduxjs/toolkit';
import type { Card, Printing, CardSetT, CardFoilingT, CardRarityT } from '@codex/core';
import { SET_ORDER, FOILING_ORDER, RARITY_ORDER } from '@codex/core';
import type { RootState } from '@/store';
import { selectFilters } from '@/store/filters/filters.selectors';
import {
  COMPARISON_OPERATORS,
  SORT_ORDER,
  type NumericFilterT,
  type SortOrderT,
} from '@/store/filters/filters.slice';

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

export const selectVisibleCards = createSelector(
  selectSearchResults,
  selectFilters,
  (cards, f): Card[] => {
    const filteredCards = cards.filter((card) => {
      if (!matchesMultiFilter(card.classes, f.classes)) return false;
      if (!matchesMultiFilter(card.talents, f.talents)) return false;
      if (!matchesMultiFilter(card.types, f.types)) return false;
      if (!matchesMultiFilter(card.subtypes, f.subtypes)) return false;
      if (!matchesMultiFilter(card.keywords, f.keywords)) return false;
      if (!matchesNumericFilter(card.cost, f.cost)) return false;
      if (!matchesNumericFilter(card.pitch, f.pitch)) return false;
      if (!matchesNumericFilter(card.attack, f.attack)) return false;
      return matchesNumericFilter(card.defense, f.defense);
    });

    const matchesPrintingFilters = (p: Printing): boolean => {
      if (f.sets.length > 0 && !f.sets.includes(p.set)) return false;
      if (f.rarities.length > 0 && !f.rarities.includes(p.rarity)) return false;
      if (f.foilings.length > 0 && (!p.foiling || !f.foilings.includes(p.foiling))) return false;
      return true;
    };

    const visibleCards = filteredCards
      .map((card) => ({
        ...card,
        printings: card.printings
          .filter((p) => !p.print.includes('-Back'))
          .filter(
            (p) =>
              matchesPrintingFilters(p) ||
              (!f.groupPrintings && p.backPrinting && matchesPrintingFilters(p.backPrinting)),
          )
          .sort((a, b) => {
            const diff = setIdx(a.set) - setIdx(b.set);
            return diff !== 0 ? diff : a.identifier.localeCompare(b.identifier);
          }),
      }))
      .filter((card) => card.printings.length > 0)
      .map((card) => ({
        ...card,
        printings: f.groupPrintings
          ? [pickGroupedPrinting(card.printings, f.foilings, f.rarities)]
          : card.printings,
      }))
      .filter((card) => card.printings.length > 0);

    return f.searchQuery.trim() ? visibleCards : sortCards(visibleCards, f.sortOrder);
  },
);

export type CardWithActivePrinting = {
  card: Card;
  printing: Printing;
  backPrinting?: Printing;
};

export const selectCardPrintings = createSelector(
  selectVisibleCards,
  selectFilters,
  (cards, f): CardWithActivePrinting[] => {
    const result = cards.flatMap((card) =>
      card.printings.map((printing) => ({
        card,
        printing,
        backPrinting: printing.backPrinting ?? undefined,
      })),
    );

    if (
      !f.searchQuery.trim() &&
      (f.sortOrder === SORT_ORDER.SET_ASC || f.sortOrder === SORT_ORDER.SET_DESC)
    ) {
      const dir = f.sortOrder === SORT_ORDER.SET_ASC ? 1 : -1;
      result.sort((a, b) => {
        const diff = setIdx(a.printing.set) - setIdx(b.printing.set);
        return diff !== 0 ? diff * dir : a.printing.identifier.localeCompare(b.printing.identifier);
      });
    }

    return result;
  },
);

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
    const setDiff = setIdx(a.set) - setIdx(b.set);
    return setDiff !== 0 ? setDiff : a.identifier.localeCompare(b.identifier);
  })[0];

// ── Filter helpers ───────────────────────────────────────────────────────────

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

const sortCards = (cards: Card[], order: SortOrderT): Card[] =>
  [...cards].sort((a, b) => {
    switch (order) {
      case SORT_ORDER.SET_DESC: {
        const diff = setIdx(b.printings[0].set) - setIdx(a.printings[0].set);
        return diff !== 0
          ? diff
          : b.printings[0].identifier.localeCompare(a.printings[0].identifier);
      }
      case SORT_ORDER.NAME_ASC:
        return a.name.localeCompare(b.name);
      case SORT_ORDER.NAME_DESC:
        return b.name.localeCompare(a.name);
      default: {
        const diff = setIdx(a.printings[0].set) - setIdx(b.printings[0].set);
        return diff !== 0
          ? diff
          : a.printings[0].identifier.localeCompare(b.printings[0].identifier);
      }
    }
  });
