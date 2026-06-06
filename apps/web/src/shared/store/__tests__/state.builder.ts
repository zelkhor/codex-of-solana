import { type ActionCreatorWithPayload, createAction, createReducer } from '@reduxjs/toolkit';

import type {
  Card,
  CardClassT,
  CardFoilingT,
  CardKeywordT,
  CardRarityT,
  CardSetT,
  CardSubtypeT,
  CardTalentT,
  CardTypeT,
} from '@codex/core';

import type { RootState } from '@/shared/store';
import { rootReducer } from '@/shared/store';
import type { NumericComparisonT } from '@/shared/types/comparison-operator.ts';
import type { SortOrderT } from '@/shared/types/sort-order.ts';

const initialState: RootState = rootReducer(undefined, { type: '@@INIT' });

const withAllCards = createAction<Card[]>('withAllCards');
const withSearchResults = createAction<Card[]>('withSearchResults');
const withClasses = createAction<CardClassT[]>('withClasses');
const withTalents = createAction<CardTalentT[]>('withTalents');
const withTypes = createAction<CardTypeT[]>('withTypes');
const withSubtypes = createAction<CardSubtypeT[]>('withSubtypes');
const withKeywords = createAction<CardKeywordT[]>('withKeywords');
const withSets = createAction<CardSetT[]>('withSets');
const withRarities = createAction<CardRarityT[]>('withRarities');
const withFoilings = createAction<CardFoilingT[]>('withFoilings');
const withArtists = createAction<string[]>('withArtists');
const withSearchQuery = createAction<string>('withSearchQuery');
const withSortOrder = createAction<SortOrderT>('withSortOrder');
const withGroupPrintings = createAction<boolean>('withGroupPrintings');
const withCostFilter = createAction<NumericComparisonT>('withCostFilter');
const withPitchFilter = createAction<NumericComparisonT>('withPitchFilter');
const withAttackFilter = createAction<NumericComparisonT>('withAttackFilter');
const withDefenseFilter = createAction<NumericComparisonT>('withDefenseFilter');

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(withAllCards, (state, { payload }) => {
      state.cardCatalog.allCards = payload;
      state.cardCatalog.searchResults = payload;
      state.cardCatalog.status = 'succeeded';
    })
    .addCase(withSearchResults, (state, { payload }) => {
      state.cardCatalog.searchResults = payload;
    })
    .addCase(withClasses, (state, { payload }) => {
      state.filters.classes = payload;
    })
    .addCase(withTalents, (state, { payload }) => {
      state.filters.talents = payload;
    })
    .addCase(withTypes, (state, { payload }) => {
      state.filters.types = payload;
    })
    .addCase(withSubtypes, (state, { payload }) => {
      state.filters.subtypes = payload;
    })
    .addCase(withKeywords, (state, { payload }) => {
      state.filters.keywords = payload;
    })
    .addCase(withSets, (state, { payload }) => {
      state.filters.sets = payload;
    })
    .addCase(withRarities, (state, { payload }) => {
      state.filters.rarities = payload;
    })
    .addCase(withFoilings, (state, { payload }) => {
      state.filters.foilings = payload;
    })
    .addCase(withArtists, (state, { payload }) => {
      state.filters.artists = payload;
    })
    .addCase(withSearchQuery, (state, { payload }) => {
      state.filters.searchQuery = payload;
    })
    .addCase(withSortOrder, (state, { payload }) => {
      state.filters.sortOrder = payload;
    })
    .addCase(withGroupPrintings, (state, { payload }) => {
      state.filters.groupPrintings = payload;
    })
    .addCase(withCostFilter, (state, { payload }) => {
      state.filters.cost = payload;
    })
    .addCase(withPitchFilter, (state, { payload }) => {
      state.filters.pitch = payload;
    })
    .addCase(withAttackFilter, (state, { payload }) => {
      state.filters.attack = payload;
    })
    .addCase(withDefenseFilter, (state, { payload }) => {
      state.filters.defense = payload;
    });
});

export const stateBuilder = (state = initialState) => {
  const reduce =
    <P>(action: ActionCreatorWithPayload<P>) =>
    (payload: P) =>
      stateBuilder(reducer(state, action(payload)));

  return {
    withAllCards: reduce(withAllCards),
    withSearchResults: reduce(withSearchResults),
    withClasses: reduce(withClasses),
    withTalents: reduce(withTalents),
    withTypes: reduce(withTypes),
    withSubtypes: reduce(withSubtypes),
    withKeywords: reduce(withKeywords),
    withSets: reduce(withSets),
    withRarities: reduce(withRarities),
    withFoilings: reduce(withFoilings),
    withArtists: reduce(withArtists),
    withSearchQuery: reduce(withSearchQuery),
    withSortOrder: reduce(withSortOrder),
    withGroupPrintings: reduce(withGroupPrintings),
    withCostFilter: reduce(withCostFilter),
    withPitchFilter: reduce(withPitchFilter),
    withAttackFilter: reduce(withAttackFilter),
    withDefenseFilter: reduce(withDefenseFilter),
    build: (): RootState => state,
  };
};

export const stateBuilderProvider = () => {
  let builder = stateBuilder();
  return {
    getState: () => builder.build(),
    setState: (updateFn: (_builder: StateBuilder) => StateBuilder) => (builder = updateFn(builder)),
  };
};

export type StateBuilder = ReturnType<typeof stateBuilder>;
export type StateBuilderProvider = ReturnType<typeof stateBuilderProvider>;
