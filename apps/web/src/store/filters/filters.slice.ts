import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  classes: string[];
  talents: string[];
  types: string[];
  keywords: string[];
  sets: string[];
  rarities: string[];
  searchQuery: string;
}

const initialState: FiltersState = {
  classes: [],
  talents: [],
  types: [],
  keywords: [],
  sets: [],
  rarities: [],
  searchQuery: '',
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setClasses(state, action: PayloadAction<string[]>) {
      state.classes = action.payload;
    },
    setTalents(state, action: PayloadAction<string[]>) {
      state.talents = action.payload;
    },
    setTypes(state, action: PayloadAction<string[]>) {
      state.types = action.payload;
    },
    setKeywords(state, action: PayloadAction<string[]>) {
      state.keywords = action.payload;
    },
    setSets(state, action: PayloadAction<string[]>) {
      state.sets = action.payload;
    },
    setRarities(state, action: PayloadAction<string[]>) {
      state.rarities = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setClasses,
  setTalents,
  setTypes,
  setKeywords,
  setSets,
  setRarities,
  setSearchQuery,
  resetFilters,
} = filtersSlice.actions;
