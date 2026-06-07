import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  type ClassT,
  type FoilingT,
  type HeroT,
  type KeywordT,
  type RarityT,
  type SetT,
  type SubtypeT,
  type TalentT,
  type TypeT,
} from '@codex/core';

import {
  COMPARISON_OPERATORS,
  type NumericComparisonT,
} from '@/shared/types/comparison-operator.ts';
import { FILTER_MODES, type FilterModeT } from '@/shared/types/filter-mode.ts';
import { SORT_ORDER, type SortOrderT } from '@/shared/types/sort-order.ts';

const emptyNumericFilter: NumericComparisonT = { operator: COMPARISON_OPERATORS.GTE, value: null };

export interface FiltersState {
  classes: ClassT[];
  classFilterMode: FilterModeT;
  talents: TalentT[];
  talentFilterMode: FilterModeT;
  types: TypeT[];
  typeFilterMode: FilterModeT;
  subtypes: SubtypeT[];
  subtypeFilterMode: FilterModeT;
  keywords: KeywordT[];
  keywordFilterMode: FilterModeT;
  sets: SetT[];
  rarities: RarityT[];
  foilings: FoilingT[];
  artists: string[];
  hero: HeroT | null;
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
  classFilterMode: FILTER_MODES.ANY,
  talents: [],
  talentFilterMode: FILTER_MODES.ANY,
  types: [],
  typeFilterMode: FILTER_MODES.ANY,
  subtypes: [],
  subtypeFilterMode: FILTER_MODES.ANY,
  keywords: [],
  keywordFilterMode: FILTER_MODES.ANY,
  sets: [],
  rarities: [],
  foilings: [],
  artists: [],
  hero: null,
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
    setClasses(state, action: PayloadAction<ClassT[]>) {
      state.classes = action.payload;
    },
    setClassFilterMode(state, action: PayloadAction<FilterModeT>) {
      state.classFilterMode = action.payload;
    },
    setTalents(state, action: PayloadAction<TalentT[]>) {
      state.talents = action.payload;
    },
    setTalentFilterMode(state, action: PayloadAction<FilterModeT>) {
      state.talentFilterMode = action.payload;
    },
    setTypes(state, action: PayloadAction<TypeT[]>) {
      state.types = action.payload;
    },
    setTypeFilterMode(state, action: PayloadAction<FilterModeT>) {
      state.typeFilterMode = action.payload;
    },
    setSubtypes(state, action: PayloadAction<SubtypeT[]>) {
      state.subtypes = action.payload;
    },
    setSubtypeFilterMode(state, action: PayloadAction<FilterModeT>) {
      state.subtypeFilterMode = action.payload;
    },
    setKeywords(state, action: PayloadAction<KeywordT[]>) {
      state.keywords = action.payload;
    },
    setKeywordFilterMode(state, action: PayloadAction<FilterModeT>) {
      state.keywordFilterMode = action.payload;
    },
    setSets(state, action: PayloadAction<SetT[]>) {
      state.sets = action.payload;
    },
    setRarities(state, action: PayloadAction<RarityT[]>) {
      state.rarities = action.payload;
    },
    setFoilings(state, action: PayloadAction<FoilingT[]>) {
      state.foilings = action.payload;
    },
    setArtists(state, action: PayloadAction<string[]>) {
      state.artists = action.payload;
    },
    setHero(state, action: PayloadAction<HeroT | null>) {
      state.hero = action.payload;
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
  setClassFilterMode,
  setTalents,
  setTalentFilterMode,
  setTypes,
  setTypeFilterMode,
  setSubtypes,
  setSubtypeFilterMode,
  setKeywords,
  setKeywordFilterMode,
  setSets,
  setRarities,
  setFoilings,
  setArtists,
  setHero,
  setSearchQuery,
  setSortOrder,
  setCostFilter,
  setPitchFilter,
  setAttackFilter,
  setDefenseFilter,
  setGroupPrintings,
  resetFilters,
} = filtersSlice.actions;
