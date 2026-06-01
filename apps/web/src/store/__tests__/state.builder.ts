import { createAction, createReducer, type ActionCreatorWithPayload } from '@reduxjs/toolkit';
import type { CardDto } from '@codex/shared';
import { rootReducer } from '@/store';
import type { RootState } from '@/store';

const initialState: RootState = rootReducer(undefined, { type: '@@INIT' });

const withAllCards = createAction<CardDto[]>('withAllCards');
const withSearchResults = createAction<CardDto[]>('withSearchResults');
const withClasses = createAction<string[]>('withClasses');
const withTalents = createAction<string[]>('withTalents');
const withTypes = createAction<string[]>('withTypes');
const withKeywords = createAction<string[]>('withKeywords');
const withSets = createAction<string[]>('withSets');
const withRarities = createAction<string[]>('withRarities');
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
    withSearchQuery: reduce(withSearchQuery),
    build: (): RootState => state,
  };
};

export type StateBuilder = ReturnType<typeof stateBuilder>;
