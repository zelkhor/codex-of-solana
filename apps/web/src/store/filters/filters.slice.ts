import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
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

export const COMPARISON_OPERATORS = {
  GT: '>',
  GTE: '>=',
  EQ: '=',
  LTE: '<=',
  LT: '<',
};
export type ComparisonOperatorT = (typeof COMPARISON_OPERATORS)[keyof typeof COMPARISON_OPERATORS];

export interface NumericFilterT {
  operator: ComparisonOperatorT;
  value: number | null;
}

const emptyNumericFilter: NumericFilterT = { operator: COMPARISON_OPERATORS.GTE, value: null };

export const SORT_ORDER = {
  SET_ASC: 'set-asc',
  SET_DESC: 'set-desc',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
};
export type SortOrderT = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export interface FiltersState {
  classes: CardClassT[];
  talents: CardTalentT[];
  types: CardTypeT[];
  subtypes: CardSubtypeT[];
  keywords: CardKeywordT[];
  sets: CardSetT[];
  rarities: CardRarityT[];
  foilings: CardFoilingT[];
  searchQuery: string;
  sortOrder: SortOrderT;
  cost: NumericFilterT;
  pitch: NumericFilterT;
  attack: NumericFilterT;
  defense: NumericFilterT;
  groupPrintings: boolean;
}

export const initialFiltersState: FiltersState = {
  classes: [],
  talents: [],
  types: [],
  subtypes: [],
  keywords: [],
  sets: [],
  rarities: [],
  foilings: [],
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
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSortOrder(state, action: PayloadAction<SortOrderT>) {
      state.sortOrder = action.payload;
    },
    setCostFilter(state, action: PayloadAction<NumericFilterT>) {
      state.cost = action.payload;
    },
    setPitchFilter(state, action: PayloadAction<NumericFilterT>) {
      state.pitch = action.payload;
    },
    setAttackFilter(state, action: PayloadAction<NumericFilterT>) {
      state.attack = action.payload;
    },
    setDefenseFilter(state, action: PayloadAction<NumericFilterT>) {
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
  setTypes,
  setSubtypes,
  setKeywords,
  setSets,
  setRarities,
  setFoilings,
  setSearchQuery,
  setSortOrder,
  setCostFilter,
  setPitchFilter,
  setAttackFilter,
  setDefenseFilter,
  setGroupPrintings,
  resetFilters,
} = filtersSlice.actions;
