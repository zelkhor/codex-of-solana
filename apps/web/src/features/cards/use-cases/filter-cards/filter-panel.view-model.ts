import { useDispatch, useSelector } from 'react-redux';

import type {
  CardClassT,
  CardFoilingT,
  CardKeywordT,
  CardRarityT,
  CardSetT,
  CardSubtypeT,
  CardTalentT,
  CardTypeT,
} from '@codex/core';

import type { AppDispatch } from '@/shared/store';
import { type NumericComparisonT } from '@/shared/types/comparison-operator.ts';
import { SORT_ORDER, type SortOrderT } from '@/shared/types/sort-order.ts';

import { selectAllArtists } from '@/domain/card-catalog/domain/select-all-artists.selector.ts';
import {
  type FiltersState,
  resetFilters,
  setArtists,
  setAttackFilter,
  setClasses,
  setCostFilter,
  setDefenseFilter,
  setFoilings,
  setGroupPrintings,
  setKeywords,
  setPitchFilter,
  setRarities,
  setSets,
  setSortOrder,
  setSubtypes,
  setTalents,
  setTypes,
} from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export interface FilterPanelViewModel {
  filters: FiltersState;
  allArtists: string[];
  sortOrderValue: string;
  isSortDisabled: boolean;
  sortOrderOptions: { value: string; label: string }[];
  setClasses: (v: CardClassT[]) => void;
  setTalents: (v: CardTalentT[]) => void;
  setTypes: (v: CardTypeT[]) => void;
  setSubtypes: (v: CardSubtypeT[]) => void;
  setKeywords: (v: CardKeywordT[]) => void;
  setSets: (v: CardSetT[]) => void;
  setRarities: (v: CardRarityT[]) => void;
  setFoilings: (v: CardFoilingT[]) => void;
  setArtists: (v: string[]) => void;
  setSortOrder: (v: SortOrderT) => void;
  setCostFilter: (v: NumericComparisonT) => void;
  setPitchFilter: (v: NumericComparisonT) => void;
  setAttackFilter: (v: NumericComparisonT) => void;
  setDefenseFilter: (v: NumericComparisonT) => void;
  setGroupPrintings: (v: boolean) => void;
  reset: () => void;
}

export const useFilterPanelViewModel = (): FilterPanelViewModel => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector(selectFilters);
  const allArtists = useSelector(selectAllArtists);

  const hasSearchQuery = !!filters.searchQuery.trim();

  const sortOrderOptions = [
    ...(hasSearchQuery ? [{ value: 'relevance', label: 'By relevance' }] : []),
    { value: SORT_ORDER.SET_ASC, label: 'Set release ↑' },
    { value: SORT_ORDER.SET_DESC, label: 'Set release ↓' },
    { value: SORT_ORDER.NAME_ASC, label: 'Name A → Z' },
    { value: SORT_ORDER.NAME_DESC, label: 'Name Z → A' },
  ];

  return {
    filters,
    allArtists,
    sortOrderValue: hasSearchQuery ? 'relevance' : filters.sortOrder,
    isSortDisabled: hasSearchQuery,
    sortOrderOptions,
    setClasses: (v) => dispatch(setClasses(v)),
    setTalents: (v) => dispatch(setTalents(v)),
    setTypes: (v) => dispatch(setTypes(v)),
    setSubtypes: (v) => dispatch(setSubtypes(v)),
    setKeywords: (v) => dispatch(setKeywords(v)),
    setSets: (v) => dispatch(setSets(v)),
    setRarities: (v) => dispatch(setRarities(v)),
    setFoilings: (v) => dispatch(setFoilings(v)),
    setArtists: (v) => dispatch(setArtists(v)),
    setSortOrder: (v) => dispatch(setSortOrder(v)),
    setCostFilter: (v) => dispatch(setCostFilter(v)),
    setPitchFilter: (v) => dispatch(setPitchFilter(v)),
    setAttackFilter: (v) => dispatch(setAttackFilter(v)),
    setDefenseFilter: (v) => dispatch(setDefenseFilter(v)),
    setGroupPrintings: (v) => dispatch(setGroupPrintings(v)),
    reset: () => dispatch(resetFilters()),
  };
};
