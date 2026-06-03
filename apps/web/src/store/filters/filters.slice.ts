import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  CardClassT,
  CardTalentT,
  CardTypeT,
  CardKeywordT,
  CardSetT,
  CardRarityT,
  CardFoilingT,
} from '@codex/shared';

export interface FiltersState {
  classes: CardClassT[];
  talents: CardTalentT[];
  types: CardTypeT[];
  keywords: CardKeywordT[];
  sets: CardSetT[];
  rarities: CardRarityT[];
  foilings: CardFoilingT[];
  searchQuery: string;
}

const initialState: FiltersState = {
  classes: [],
  talents: [],
  types: [],
  keywords: [],
  sets: [],
  rarities: [],
  foilings: [],
  searchQuery: '',
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
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
  setFoilings,
  setSearchQuery,
  resetFilters,
} = filtersSlice.actions;
