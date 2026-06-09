import { type ActionCreatorWithPayload, createAction, createReducer } from '@reduxjs/toolkit';

import type {
  Card,
  ClassT,
  FoilingT,
  FormatT,
  HeroT,
  KeywordT,
  RarityT,
  SetT,
  SubtypeT,
  TalentT,
  TreatmentT,
  TypeT,
} from '@codex/core';

import type { NumericComparisonT } from '@/shared/types/comparison-operator.ts';
import type { FilterModeT } from '@/shared/types/filter-mode.ts';
import type { SortOrderT } from '@/shared/types/sort-order.ts';

import { cardsAdapter } from '@/domain/card-catalog/domain/card.entity.ts';
import type { RootState } from '@/domain/store';
import { rootReducer } from '@/domain/store';

const initialState: RootState = rootReducer(undefined, { type: '@@INIT' });

const withAllCards = createAction<Card[]>('withAllCards');
const withSearchResults = createAction<Card[]>('withSearchResults');
const withSearchResultIdentifiers = createAction<string[] | null>('withSearchResultIdentifiers');
const withClasses = createAction<ClassT[]>('withClasses');
const withClassFilterMode = createAction<FilterModeT>('withClassFilterMode');
const withTalents = createAction<TalentT[]>('withTalents');
const withTypes = createAction<TypeT[]>('withTypes');
const withTypeFilterMode = createAction<FilterModeT>('withTypeFilterMode');
const withSubtypes = createAction<SubtypeT[]>('withSubtypes');
const withSubtypeFilterMode = createAction<FilterModeT>('withSubtypeFilterMode');
const withKeywords = createAction<KeywordT[]>('withKeywords');
const withKeywordFilterMode = createAction<FilterModeT>('withKeywordFilterMode');
const withSets = createAction<SetT[]>('withSets');
const withRarities = createAction<RarityT[]>('withRarities');
const withFoilings = createAction<FoilingT[]>('withFoilings');
const withTreatments = createAction<TreatmentT[]>('withTreatments');
const withTreatmentFilterMode = createAction<FilterModeT>('withTreatmentFilterMode');
const withArtists = createAction<string[]>('withArtists');
const withHero = createAction<HeroT | null>('withHero');
const withFormat = createAction<FormatT | null>('withFormat');
const withSearchQuery = createAction<string>('withSearchQuery');
const withSortOrder = createAction<SortOrderT>('withSortOrder');
const withGroupPrintings = createAction<boolean>('withGroupPrintings');
const withTalentFilterMode = createAction<FilterModeT>('withTalentFilterMode');
const withCostFilter = createAction<NumericComparisonT>('withCostFilter');
const withPitchFilter = createAction<NumericComparisonT>('withPitchFilter');
const withAttackFilter = createAction<NumericComparisonT>('withAttackFilter');
const withDefenseFilter = createAction<NumericComparisonT>('withDefenseFilter');

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(withAllCards, (state, { payload }) => {
      cardsAdapter.setAll(state.cardCatalog, payload);
      state.cardCatalog.searchResultIdentifiers = null;
      state.cardCatalog.status = 'succeeded';
    })
    .addCase(withSearchResults, (state, { payload }) => {
      cardsAdapter.upsertMany(state.cardCatalog, payload);
      state.cardCatalog.searchResultIdentifiers = payload.map((card) => card.cardIdentifier);
    })
    .addCase(withSearchResultIdentifiers, (state, { payload }) => {
      state.cardCatalog.searchResultIdentifiers = payload;
    })
    .addCase(withClasses, (state, { payload }) => {
      state.filters.classes = payload;
    })
    .addCase(withClassFilterMode, (state, { payload }) => {
      state.filters.classFilterMode = payload;
    })
    .addCase(withTalents, (state, { payload }) => {
      state.filters.talents = payload;
    })
    .addCase(withTypes, (state, { payload }) => {
      state.filters.types = payload;
    })
    .addCase(withTypeFilterMode, (state, { payload }) => {
      state.filters.typeFilterMode = payload;
    })
    .addCase(withSubtypes, (state, { payload }) => {
      state.filters.subtypes = payload;
    })
    .addCase(withSubtypeFilterMode, (state, { payload }) => {
      state.filters.subtypeFilterMode = payload;
    })
    .addCase(withKeywords, (state, { payload }) => {
      state.filters.keywords = payload;
    })
    .addCase(withKeywordFilterMode, (state, { payload }) => {
      state.filters.keywordFilterMode = payload;
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
    .addCase(withTreatments, (state, { payload }) => {
      state.filters.treatments = payload;
    })
    .addCase(withTreatmentFilterMode, (state, { payload }) => {
      state.filters.treatmentFilterMode = payload;
    })
    .addCase(withArtists, (state, { payload }) => {
      state.filters.artists = payload;
    })
    .addCase(withHero, (state, { payload }) => {
      state.filters.hero = payload;
    })
    .addCase(withFormat, (state, { payload }) => {
      state.filters.format = payload;
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
    .addCase(withTalentFilterMode, (state, { payload }) => {
      state.filters.talentFilterMode = payload;
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
    withSearchResultIdentifiers: reduce(withSearchResultIdentifiers),
    withClasses: reduce(withClasses),
    withClassFilterMode: reduce(withClassFilterMode),
    withTalents: reduce(withTalents),
    withTypes: reduce(withTypes),
    withTypeFilterMode: reduce(withTypeFilterMode),
    withSubtypes: reduce(withSubtypes),
    withSubtypeFilterMode: reduce(withSubtypeFilterMode),
    withKeywords: reduce(withKeywords),
    withKeywordFilterMode: reduce(withKeywordFilterMode),
    withSets: reduce(withSets),
    withRarities: reduce(withRarities),
    withFoilings: reduce(withFoilings),
    withTreatments: reduce(withTreatments),
    withTreatmentFilterMode: reduce(withTreatmentFilterMode),
    withArtists: reduce(withArtists),
    withHero: reduce(withHero),
    withFormat: reduce(withFormat),
    withSearchQuery: reduce(withSearchQuery),
    withSortOrder: reduce(withSortOrder),
    withGroupPrintings: reduce(withGroupPrintings),
    withTalentFilterMode: reduce(withTalentFilterMode),
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
