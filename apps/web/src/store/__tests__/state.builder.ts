import { createAction, createReducer, type ActionCreatorWithPayload } from '@reduxjs/toolkit';
import type {
  Card,
  CardClassT,
  CardTalentT,
  CardTypeT,
  CardKeywordT,
  CardSetT,
  CardRarityT,
  CardFoilingT,
} from '@codex/core';
import { rootReducer } from '@/store';
import type { RootState } from '@/store';

const initialState: RootState = rootReducer(undefined, { type: '@@INIT' });

const withAllCards = createAction<Card[]>('withAllCards');
const withSearchResults = createAction<Card[]>('withSearchResults');
const withClasses = createAction<CardClassT[]>('withClasses');
const withTalents = createAction<CardTalentT[]>('withTalents');
const withTypes = createAction<CardTypeT[]>('withTypes');
const withKeywords = createAction<CardKeywordT[]>('withKeywords');
const withSets = createAction<CardSetT[]>('withSets');
const withRarities = createAction<CardRarityT[]>('withRarities');
const withFoilings = createAction<CardFoilingT[]>('withFoilings');
const withSearchQuery = createAction<string>('withSearchQuery');

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
    .addCase(withSearchQuery, (state, { payload }) => {
      state.filters.searchQuery = payload;
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
    withKeywords: reduce(withKeywords),
    withSets: reduce(withSets),
    withRarities: reduce(withRarities),
    withFoilings: reduce(withFoilings),
    withSearchQuery: reduce(withSearchQuery),
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
