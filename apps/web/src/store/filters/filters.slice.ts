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
  resetFilters,
} = filtersSlice.actions;
