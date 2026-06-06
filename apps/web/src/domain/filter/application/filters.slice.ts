import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  type CardClassT,
  type CardFoilingT,
  type CardKeywordT,
  type CardRarityT,
  type CardSetT,
  type CardSubtypeT,
  type CardTalentT,
  type CardTypeT,
} from '@codex/core';

import {
  COMPARISON_OPERATORS,
  type NumericComparisonT,
} from '@/shared/types/comparison-operator.ts';
import { SORT_ORDER, type SortOrderT } from '@/shared/types/sort-order.ts';

const emptyNumericFilter: NumericComparisonT = { operator: COMPARISON_OPERATORS.GTE, value: null };

export interface FiltersState {
  classes: CardClassT[];
  talents: CardTalentT[];
  excludeCardsWithTalent: boolean;
  types: CardTypeT[];
  subtypes: CardSubtypeT[];
  keywords: CardKeywordT[];
  sets: CardSetT[];
  rarities: CardRarityT[];
  foilings: CardFoilingT[];
  artists: string[];
  searchQuery: string;
  sortOrder: SortOrderT;
  cost: NumericComparisonT;
  pitch: NumericComparisonT;
  attack: NumericComparisonT;
  defense: NumericComparisonT;
  groupPrintings: boolean;
}

export const initialFiltersState: FiltersState = {
  classes: [],
  talents: [],
  excludeCardsWithTalent: false,
  types: [],
  subtypes: [],
  keywords: [],
  sets: [],
  rarities: [],
  foilings: [],
  artists: [],
  searchQuery: '',
  sortOrder: SORT_ORDER.SET_ASC,
  cost: emptyNumericFilter,
  pitch: emptyNumericFilter,
  attack: emptyNumericFilter,
  defense: emptyNumericFilter,
  groupPrintings: false,
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFiltersState,
  reducers: {
    setClasses(state, action: PayloadAction<CardClassT[]>) {
      state.classes = action.payload;
    },
    setTalents(state, action: PayloadAction<CardTalentT[]>) {
      state.talents = action.payload;
      state.excludeCardsWithTalent = false;
    },
    setExcludeCardsWithTalent(state, action: PayloadAction<boolean>) {
      state.excludeCardsWithTalent = action.payload;
      if (action.payload) state.talents = [];
    },
    setTypes(state, action: PayloadAction<CardTypeT[]>) {
      state.types = action.payload;
    },
    setSubtypes(state, action: PayloadAction<CardSubtypeT[]>) {
      state.subtypes = action.payload;
    },
    setKeywords(state, action: PayloadAction<CardKeywordT[]>) {
      state.keywords = action.payload;
    },
    setSets(state, action: PayloadAction<CardSetT[]>) {
      state.sets = action.payload;
    },
    setRarities(state, action: PayloadAction<CardRarityT[]>) {
      state.rarities = action.payload;
    },
    setFoilings(state, action: PayloadAction<CardFoilingT[]>) {
      state.foilings = action.payload;
    },
    setArtists(state, action: PayloadAction<string[]>) {
      state.artists = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSortOrder(state, action: PayloadAction<SortOrderT>) {
      state.sortOrder = action.payload;
    },
    setCostFilter(state, action: PayloadAction<NumericComparisonT>) {
      state.cost = action.payload;
    },
    setPitchFilter(state, action: PayloadAction<NumericComparisonT>) {
      state.pitch = action.payload;
    },
    setAttackFilter(state, action: PayloadAction<NumericComparisonT>) {
      state.attack = action.payload;
    },
    setDefenseFilter(state, action: PayloadAction<NumericComparisonT>) {
      state.defense = action.payload;
    },
    setGroupPrintings(state, action: PayloadAction<boolean>) {
      state.groupPrintings = action.payload;
    },
    resetFilters() {
      return initialFiltersState;
    },
  },
});

export const {
  setClasses,
  setTalents,
  setExcludeCardsWithTalent,
  setTypes,
  setSubtypes,
  setKeywords,
  setSets,
  setRarities,
  setFoilings,
  setArtists,
  setSearchQuery,
  setSortOrder,
  setCostFilter,
  setPitchFilter,
  setAttackFilter,
  setDefenseFilter,
  setGroupPrintings,
  resetFilters,
} = filtersSlice.actions;
