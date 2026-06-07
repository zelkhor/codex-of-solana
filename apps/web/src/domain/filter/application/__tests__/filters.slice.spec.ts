import { beforeEach, describe, test } from 'vitest';

import {
  CLASSES,
  FOILINGS,
  HEROES,
  KEYWORDS,
  RARITIES,
  SETS,
  SUBTYPES,
  TALENTS,
  TREATMENTS,
  TYPES,
} from '@codex/core';

import { stateBuilderProvider } from '@/shared/store/__tests__/state.builder.ts';
import { FILTER_MODES } from '@/shared/types/filter-mode.ts';

import {
  type FiltersSliceFixture,
  createFiltersSliceFixture,
} from '@/domain/filter/application/__tests__/filters.slice.fixture.ts';
import { initialFiltersState } from '@/domain/filter/application/filters.slice.ts';

describe('Feature: Filtering cards', () => {
  let fixture: FiltersSliceFixture;

  beforeEach(() => {
    fixture = createFiltersSliceFixture(stateBuilderProvider());
  });

  test('Rule: I should be able to filter cards by class', () => {
    fixture.whenAddingClassFilter([CLASSES.Generic, CLASSES.Ninja]);
    fixture.thenFiltersShouldBe({ classes: [CLASSES.Generic, CLASSES.Ninja] });
  });

  test('Rule: I should be able to switch the class filter to exact matching mode', () => {
    fixture.whenSettingClassFilterMode(FILTER_MODES.EXACT);
    fixture.thenFiltersShouldBe({ classFilterMode: FILTER_MODES.EXACT });
  });

  test('Rule: I should be able to switch the class filter back to any-match mode', () => {
    fixture.givenActiveFilters((b) => b.withClassFilterMode(FILTER_MODES.EXACT));
    fixture.whenSettingClassFilterMode(FILTER_MODES.ANY);
    fixture.thenFiltersShouldBe({ classFilterMode: FILTER_MODES.ANY });
  });

  test('Rule: I should be able to filter cards by talent', () => {
    fixture.whenAddingTalentFilter([TALENTS.Shadow, TALENTS.Draconic]);
    fixture.thenFiltersShouldBe({ talents: [TALENTS.Shadow, TALENTS.Draconic] });
  });

  test('Rule: I should be able to switch the talent filter to exact matching mode', () => {
    fixture.whenSettingTalentFilterMode(FILTER_MODES.EXACT);
    fixture.thenFiltersShouldBe({ talentFilterMode: FILTER_MODES.EXACT });
  });

  test('Rule: I should be able to switch the talent filter back to any-match mode', () => {
    fixture.givenActiveFilters((b) => b.withTalentFilterMode(FILTER_MODES.EXACT));
    fixture.whenSettingTalentFilterMode(FILTER_MODES.ANY);
    fixture.thenFiltersShouldBe({ talentFilterMode: FILTER_MODES.ANY });
  });

  test('Rule: I should be able to filter cards by type', () => {
    fixture.whenAddingTypeFilter([TYPES.Action, TYPES.DefenseReaction]);
    fixture.thenFiltersShouldBe({ types: [TYPES.Action, TYPES.DefenseReaction] });
  });

  test('Rule: I should be able to switch the type filter to exact matching mode', () => {
    fixture.whenSettingTypeFilterMode(FILTER_MODES.EXACT);
    fixture.thenFiltersShouldBe({ typeFilterMode: FILTER_MODES.EXACT });
  });

  test('Rule: I should be able to switch the type filter back to any-match mode', () => {
    fixture.givenActiveFilters((b) => b.withTypeFilterMode(FILTER_MODES.EXACT));
    fixture.whenSettingTypeFilterMode(FILTER_MODES.ANY);
    fixture.thenFiltersShouldBe({ typeFilterMode: FILTER_MODES.ANY });
  });

  test('Rule: I should be able to filter cards by subtype', () => {
    fixture.whenAddingSubtypeFilter([SUBTYPES.Arrow, SUBTYPES.Chi]);
    fixture.thenFiltersShouldBe({ subtypes: [SUBTYPES.Arrow, SUBTYPES.Chi] });
  });

  test('Rule: I should be able to switch the subtype filter to exact matching mode', () => {
    fixture.whenSettingSubtypeFilterMode(FILTER_MODES.EXACT);
    fixture.thenFiltersShouldBe({ subtypeFilterMode: FILTER_MODES.EXACT });
  });

  test('Rule: I should be able to switch the subtype filter back to any-match mode', () => {
    fixture.givenActiveFilters((b) => b.withSubtypeFilterMode(FILTER_MODES.EXACT));
    fixture.whenSettingSubtypeFilterMode(FILTER_MODES.ANY);
    fixture.thenFiltersShouldBe({ subtypeFilterMode: FILTER_MODES.ANY });
  });

  test('Rule: I should be able to filter cards by keyword', () => {
    fixture.whenAddingKeywordFilter([KEYWORDS.Dominate, KEYWORDS.GoAgain]);
    fixture.thenFiltersShouldBe({ keywords: [KEYWORDS.Dominate, KEYWORDS.GoAgain] });
  });

  test('Rule: I should be able to switch the keyword filter to exact matching mode', () => {
    fixture.whenSettingKeywordFilterMode(FILTER_MODES.EXACT);
    fixture.thenFiltersShouldBe({ keywordFilterMode: FILTER_MODES.EXACT });
  });

  test('Rule: I should be able to switch the keyword filter back to any-match mode', () => {
    fixture.givenActiveFilters((b) => b.withKeywordFilterMode(FILTER_MODES.EXACT));
    fixture.whenSettingKeywordFilterMode(FILTER_MODES.ANY);
    fixture.thenFiltersShouldBe({ keywordFilterMode: FILTER_MODES.ANY });
  });

  test('Rule: I should be able to filter cards by set', () => {
    fixture.whenAddingSetFilter([SETS.WelcomeToRathe, SETS.ArcaneRising]);
    fixture.thenFiltersShouldBe({ sets: [SETS.WelcomeToRathe, SETS.ArcaneRising] });
  });

  test('Rule: I should be able to filter cards by rarity', () => {
    fixture.whenAddingRarityFilter([RARITIES.Rare, RARITIES.Majestic]);
    fixture.thenFiltersShouldBe({ rarities: [RARITIES.Rare, RARITIES.Majestic] });
  });

  test('Rule: I should be able to filter cards by foiling', () => {
    fixture.whenAddingFoilingFilter([FOILINGS.Rainbow, FOILINGS.Cold]);
    fixture.thenFiltersShouldBe({ foilings: [FOILINGS.Rainbow, FOILINGS.Cold] });
  });

  test('Rule: I should be able to filter cards by art treatment', () => {
    fixture.whenAddingTreatmentFilter([TREATMENTS.AA, TREATMENTS.FA]);
    fixture.thenFiltersShouldBe({ treatments: [TREATMENTS.AA, TREATMENTS.FA] });
  });

  test('Rule: I should be able to switch the treatment filter to exact matching mode', () => {
    fixture.whenSettingTreatmentFilterMode(FILTER_MODES.EXACT);
    fixture.thenFiltersShouldBe({ treatmentFilterMode: FILTER_MODES.EXACT });
  });

  test('Rule: I should be able to switch the treatment filter back to any-match mode', () => {
    fixture.givenActiveFilters((b) => b.withTreatmentFilterMode(FILTER_MODES.EXACT));
    fixture.whenSettingTreatmentFilterMode(FILTER_MODES.ANY);
    fixture.thenFiltersShouldBe({ treatmentFilterMode: FILTER_MODES.ANY });
  });

  test('Rule: I should be able to filter cards by artist', () => {
    fixture.whenAddingArtistFilter(['Micah Epstein', 'Dominik Mayer']);
    fixture.thenFiltersShouldBe({ artists: ['Micah Epstein', 'Dominik Mayer'] });
  });

  test('Rule: I should be able to filter cards by hero legality', () => {
    fixture.whenSelectingHeroFilter(HEROES.Katsu);
    fixture.thenFiltersShouldBe({ hero: HEROES.Katsu });
  });

  test('Rule: I should be able to reset all active filters at once', () => {
    fixture.givenActiveFilters((b) =>
      b
        .withClasses([CLASSES.Generic])
        .withTalents([TALENTS.Draconic])
        .withTypes([TYPES.Action, TYPES.DefenseReaction])
        .withSubtypes([SUBTYPES.Arrow, SUBTYPES.Chi])
        .withKeywords([KEYWORDS.Dominate, KEYWORDS.GoAgain])
        .withSets([SETS.WelcomeToRathe, SETS.ArcaneRising])
        .withRarities([RARITIES.Rare, RARITIES.Majestic])
        .withFoilings([FOILINGS.Rainbow, FOILINGS.Cold])
        .withTreatments([TREATMENTS.AA, TREATMENTS.EA])
        .withArtists(['Micah Epstein', 'Dominik Mayer']),
    );
    fixture.whenResettingFilters();
    fixture.thenFiltersShouldBe(initialFiltersState);
  });
});
