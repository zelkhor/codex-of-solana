import { createSelector } from '@reduxjs/toolkit';
import type { Card, Printing, CardSetT } from '@codex/core';
import { SET_ORDER } from '@codex/core';
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
              (p.backPrinting && matchesPrintingFilters(p.backPrinting)),
          )
          .sort((a, b) => {
            const diff = setIdx(a.set) - setIdx(b.set);
            return diff !== 0 ? diff : a.identifier.localeCompare(b.identifier);
          }),
      }))
      .filter((card) => card.printings.length > 0);

    return f.searchQuery.trim() ? visibleCards : sortCards(visibleCards, f.sortOrder);
  },
);

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
