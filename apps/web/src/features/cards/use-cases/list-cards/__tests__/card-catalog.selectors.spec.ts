import { describe, test, expect } from 'vitest';
import {
  cardBuilder,
  printingBuilder,
  CARD_SETS,
  CARD_RARITIES,
  CARD_FOILINGS,
  CARD_CLASSES,
  CARD_TALENTS,
  CARD_TYPES,
  CARD_SUBTYPES,
  CARD_KEYWORDS,
} from '@codex/core';
import { stateBuilder } from '@/shared/store/__tests__/state.builder.ts';
import {
  selectCardWithActivePrinting,
  selectVisibleCards,
} from '@/features/cards/use-cases/list-cards/list-card.selectors.ts';
import { COMPARISON_OPERATORS } from '@/shared/types/comparison-operator.ts';
import { SORT_ORDER } from '@/shared/types/sort-order.ts';

// ─── Printing shortcuts ───────────────────────────────────────────────────────

const wtrPrinting = printingBuilder()
  .withIdentifier('WTR001')
  .withPrint('WTR001')
  .withSet(CARD_SETS.WelcomeToRathe)
  .withRarity(CARD_RARITIES.Common)
  .build();
const promoPrinting = printingBuilder()
  .withIdentifier('LGS001')
  .withPrint('LGS001-Rainbow')
  .withSet(CARD_SETS.Promos)
  .withRarity(CARD_RARITIES.Common)
  .build();

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Feature: Card-level filtering', () => {
  test('Rule: Returns all printings when no filters are active', () => {
    const card = cardBuilder().withPrintings([wtrPrinting, promoPrinting]).build();
    const cards = selectVisibleCards(stateBuilder().withAllCards([card]).build());
    expect(cards[0].printings).toHaveLength(2);
  });

  test('Rule: Excludes cards that do not match the class filter', () => {
    const matching = cardBuilder()
      .withCardIdentifier('a')
      .withClasses([CARD_CLASSES.Generic])
      .build();
    const excluded = cardBuilder()
      .withCardIdentifier('b')
      .withClasses([CARD_CLASSES.Warrior])
      .build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([matching, excluded]).withClasses([CARD_CLASSES.Generic]).build(),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].cardIdentifier).toBe('a');
  });

  test('Rule: Excludes cards that do not match the talent filter', () => {
    const matching = cardBuilder()
      .withCardIdentifier('a')
      .withTalents([CARD_TALENTS.Shadow])
      .build();
    const excluded = cardBuilder().withCardIdentifier('b').withTalents([]).build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([matching, excluded]).withTalents([CARD_TALENTS.Shadow]).build(),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].cardIdentifier).toBe('a');
  });

  test('Rule: Excludes cards that do not match the type filter', () => {
    const matching = cardBuilder().withCardIdentifier('a').withTypes([CARD_TYPES.Action]).build();
    const excluded = cardBuilder()
      .withCardIdentifier('b')
      .withTypes([CARD_TYPES.Equipment])
      .build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([matching, excluded]).withTypes([CARD_TYPES.Action]).build(),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].cardIdentifier).toBe('a');
  });

  test('Rule: Excludes cards that do not match the subtype filter', () => {
    const subtype = Object.values(CARD_SUBTYPES)[0];
    const matching = cardBuilder().withCardIdentifier('a').withSubtypes([subtype]).build();
    const excluded = cardBuilder().withCardIdentifier('b').withSubtypes([]).build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([matching, excluded]).withSubtypes([subtype]).build(),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].cardIdentifier).toBe('a');
  });

  test('Rule: Excludes cards that do not match the keyword filter', () => {
    const matching = cardBuilder()
      .withCardIdentifier('a')
      .withKeywords([CARD_KEYWORDS.Dominate])
      .build();
    const excluded = cardBuilder().withCardIdentifier('b').withKeywords([]).build();
    const cards = selectVisibleCards(
      stateBuilder()
        .withAllCards([matching, excluded])
        .withKeywords([CARD_KEYWORDS.Dominate])
        .build(),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].cardIdentifier).toBe('a');
  });
});

describe('Feature: Numeric stat filtering', () => {
  test('Rule: Excludes cards whose attack does not satisfy the filter', () => {
    const matching = cardBuilder().withCardIdentifier('a').withAttack(5).build();
    const excluded = cardBuilder().withCardIdentifier('b').withAttack(2).build();
    const cards = selectVisibleCards(
      stateBuilder()
        .withAllCards([matching, excluded])
        .withAttackFilter({ operator: COMPARISON_OPERATORS.GTE, value: 4 })
        .build(),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].cardIdentifier).toBe('a');
  });

  test('Rule: Excludes cards whose defense does not satisfy the filter', () => {
    const matching = cardBuilder().withCardIdentifier('a').withDefense(3).build();
    const excluded = cardBuilder().withCardIdentifier('b').withDefense(5).build();
    const cards = selectVisibleCards(
      stateBuilder()
        .withAllCards([matching, excluded])
        .withDefenseFilter({ operator: COMPARISON_OPERATORS.LT, value: 4 })
        .build(),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].cardIdentifier).toBe('a');
  });

  test('Rule: Excludes cards whose cost does not satisfy the filter', () => {
    const matching = cardBuilder().withCardIdentifier('a').withCost(2).build();
    const excluded = cardBuilder().withCardIdentifier('b').withCost(2).build();
    const cards = selectVisibleCards(
      stateBuilder()
        .withAllCards([matching, excluded])
        .withCostFilter({ operator: COMPARISON_OPERATORS.EQ, value: 2 })
        .build(),
    );
    expect(cards).toHaveLength(2);
  });

  test('Rule: Excludes cards with null stat when a numeric filter is active', () => {
    const withStat = cardBuilder().withCardIdentifier('a').withAttack(3).build();
    const withoutStat = cardBuilder().withCardIdentifier('b').withAttack(null).build();
    const cards = selectVisibleCards(
      stateBuilder()
        .withAllCards([withStat, withoutStat])
        .withAttackFilter({ operator: COMPARISON_OPERATORS.GTE, value: 1 })
        .build(),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].cardIdentifier).toBe('a');
  });

  test('Rule: Includes all cards when numeric filter has no value set', () => {
    const cardA = cardBuilder().withCardIdentifier('a').withAttack(5).build();
    const cardB = cardBuilder().withCardIdentifier('b').withAttack(null).build();
    const cards = selectVisibleCards(
      stateBuilder()
        .withAllCards([cardA, cardB])
        .withAttackFilter({ operator: COMPARISON_OPERATORS.GTE, value: null })
        .build(),
    );
    expect(cards).toHaveLength(2);
  });
});

describe('Feature: Printing-level filtering', () => {
  test('Rule: Includes only printings from the selected set', () => {
    const card = cardBuilder().withPrintings([wtrPrinting, promoPrinting]).build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([card]).withSets([CARD_SETS.WelcomeToRathe]).build(),
    );
    expect(cards[0].printings).toHaveLength(1);
    expect(cards[0].printings[0].set).toBe(CARD_SETS.WelcomeToRathe);
  });

  test('Rule: Excludes all printings when the set filter does not match any', () => {
    const card = cardBuilder().withPrintings([wtrPrinting]).build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([card]).withSets([CARD_SETS.Promos]).build(),
    );
    expect(cards).toHaveLength(0);
  });

  test('Rule: Includes only printings with the selected rarity', () => {
    const commonPrinting = printingBuilder({
      identifier: 'WTR001',
      print: 'WTR001',
      rarity: CARD_RARITIES.Common,
    }).build();
    const rarePrinting = printingBuilder({
      identifier: 'WTR002',
      print: 'WTR002',
      rarity: CARD_RARITIES.Rare,
    }).build();
    const card = cardBuilder().withPrintings([commonPrinting, rarePrinting]).build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([card]).withRarities([CARD_RARITIES.Rare]).build(),
    );
    expect(cards[0].printings).toHaveLength(1);
    expect(cards[0].printings[0].rarity).toBe(CARD_RARITIES.Rare);
  });

  test('Rule: Excludes all printings when the rarity filter does not match any', () => {
    const card = cardBuilder().withPrintings([wtrPrinting]).build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([card]).withRarities([CARD_RARITIES.Marvel]).build(),
    );
    expect(cards).toHaveLength(0);
  });

  test('Rule: Includes only printings with the selected foiling', () => {
    const rainbowPrinting = printingBuilder({
      identifier: 'WTR001-RF',
      print: 'WTR001-RF',
      foiling: CARD_FOILINGS.Rainbow,
    }).build();
    const card = cardBuilder().withPrintings([wtrPrinting, rainbowPrinting]).build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([card]).withFoilings([CARD_FOILINGS.Rainbow]).build(),
    );
    expect(cards[0].printings).toHaveLength(1);
    expect(cards[0].printings[0].foiling).toBe(CARD_FOILINGS.Rainbow);
  });

  test('Rule: Excludes all printings when the foiling filter does not match any', () => {
    const card = cardBuilder().withPrintings([wtrPrinting]).build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([card]).withFoilings([CARD_FOILINGS.Cold]).build(),
    );
    expect(cards).toHaveLength(0);
  });

  test('Rule: Includes a card when the rarity filter matches the back printing but not the front', () => {
    const back = printingBuilder({
      identifier: 'MST010',
      print: 'MST010-Back',
      rarity: CARD_RARITIES.Marvel,
      image: 'MST010_BACK',
    }).build();
    const front = printingBuilder({
      identifier: 'MST010',
      print: 'MST010',
      rarity: CARD_RARITIES.Majestic,
      image: 'MST010',
      backPrinting: back,
    }).build();
    const card = cardBuilder().withPrintings([front]).build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([card]).withRarities([CARD_RARITIES.Marvel]).build(),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].printings[0].rarity).toBe(CARD_RARITIES.Majestic);
    expect(cards[0].printings[0].backPrinting?.rarity).toBe(CARD_RARITIES.Marvel);
  });
});

describe('Feature: Artist filtering', () => {
  test('Rule: Includes only printings from the selected artist', () => {
    const micahPrinting = printingBuilder()
      .withIdentifier('WTR001')
      .withPrint('WTR001')
      .withSet(CARD_SETS.WelcomeToRathe)
      .withArtists(['Micah Epstein'])
      .build();
    const otherPrinting = printingBuilder()
      .withIdentifier('WTR002')
      .withPrint('WTR002')
      .withSet(CARD_SETS.WelcomeToRathe)
      .withArtists(['Svetlin Velinov'])
      .build();
    const card = cardBuilder().withPrintings([micahPrinting, otherPrinting]).build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([card]).withArtists(['Micah Epstein']).build(),
    );
    expect(cards[0].printings).toHaveLength(1);
    expect(cards[0].printings[0].print).toBe('WTR001');
  });

  test('Rule: Excludes all printings when the artist filter does not match any', () => {
    const card = cardBuilder()
      .withPrintings([printingBuilder().withArtists(['Micah Epstein']).build()])
      .build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([card]).withArtists(['Svetlin Velinov']).build(),
    );
    expect(cards).toHaveLength(0);
  });

  test('Rule: Includes printings matching any of the selected artists', () => {
    const cardA = cardBuilder()
      .withCardIdentifier('a')
      .withPrintings([printingBuilder().withArtists(['Micah Epstein']).build()])
      .build();
    const cardB = cardBuilder()
      .withCardIdentifier('b')
      .withPrintings([printingBuilder().withArtists(['Svetlin Velinov']).build()])
      .build();
    const cards = selectVisibleCards(
      stateBuilder()
        .withAllCards([cardA, cardB])
        .withArtists(['Micah Epstein', 'Svetlin Velinov'])
        .build(),
    );
    expect(cards).toHaveLength(2);
  });
});

describe('Feature: Double-sided card pairing', () => {
  test('Rule: Back printings (-Back) are not returned as their own entries', () => {
    const front = printingBuilder({
      identifier: 'HNT264',
      print: 'HNT264-Cold',
      foiling: CARD_FOILINGS.Cold,
    }).build();
    const back = printingBuilder({
      identifier: 'HNT264',
      print: 'HNT264-Cold-Full Art-Back',
      foiling: CARD_FOILINGS.Cold,
    }).build();
    const card = cardBuilder().withPrintings([front, back]).build();
    const cards = selectVisibleCards(stateBuilder().withAllCards([card]).build());
    expect(cards[0].printings).toHaveLength(1);
    expect(cards[0].printings[0].print).toBe('HNT264-Cold');
  });

  test('Rule: Pairs a front with its back printing', () => {
    const back = printingBuilder({
      identifier: 'HNT264',
      print: 'HNT264-Cold-Full Art-Back',
      foiling: CARD_FOILINGS.Cold,
    }).build();
    const front = printingBuilder({
      identifier: 'HNT264',
      print: 'HNT264-Cold',
      foiling: CARD_FOILINGS.Cold,
      backPrinting: back,
    }).build();
    const card = cardBuilder().withPrintings([front, back]).build();
    const cards = selectVisibleCards(stateBuilder().withAllCards([card]).build());
    expect(cards[0].printings[0].backPrinting).toEqual(back);
  });

  test('Rule: Front printing with no back printing has no back', () => {
    const tokenFront = printingBuilder({
      identifier: 'MST002',
      print: 'MST002',
      foiling: undefined,
      rarity: CARD_RARITIES.Token,
    }).build();
    const card = cardBuilder().withPrintings([tokenFront]).build();
    const cards = selectVisibleCards(stateBuilder().withAllCards([card]).build());
    expect(cards[0].printings[0].backPrinting).toBeFalsy();
  });

  test('Rule: Back printing is available even when the back card is not in search results', () => {
    const back = printingBuilder({ print: 'MST010-Back' }).build();
    const front = printingBuilder({ print: 'MST010', backPrinting: back }).build();
    const frontCard = cardBuilder().withPrintings([front]).build();
    const cards = selectVisibleCards(stateBuilder().withSearchResults([frontCard]).build());
    expect(cards[0].printings[0].backPrinting).toEqual(back);
  });
});

describe('Feature: Group printings', () => {
  test('Rule: When multiple foilings are selected, the printing with the lowest matching foiling is shown', () => {
    const coldFoilPrinting = printingBuilder()
      .withIdentifier('WTR001')
      .withPrint('WTR001-Cold')
      .withSet(CARD_SETS.WelcomeToRathe)
      .withFoiling(CARD_FOILINGS.Cold)
      .build();
    const rainbowFoilPrinting = printingBuilder()
      .withIdentifier('ARC001')
      .withPrint('ARC001-Rainbow')
      .withSet(CARD_SETS.ArcaneRising)
      .withFoiling(CARD_FOILINGS.Rainbow)
      .build();
    const card = cardBuilder().withPrintings([coldFoilPrinting, rainbowFoilPrinting]).build();
    const cards = selectVisibleCards(
      stateBuilder()
        .withAllCards([card])
        .withFoilings([CARD_FOILINGS.Cold, CARD_FOILINGS.Rainbow])
        .withGroupPrintings(true)
        .build(),
    );
    expect(cards[0].printings).toHaveLength(1);
    expect(cards[0].printings[0].foiling).toBe(CARD_FOILINGS.Rainbow);
  });

  test('Rule: When multiple rarities are selected, the printing with the lowest rarity is shown', () => {
    const majesticPrinting = printingBuilder()
      .withIdentifier('WTR001')
      .withPrint('WTR001')
      .withSet(CARD_SETS.WelcomeToRathe)
      .withRarity(CARD_RARITIES.Majestic)
      .build();
    const commonPrinting = printingBuilder()
      .withIdentifier('ARC001')
      .withPrint('ARC001')
      .withSet(CARD_SETS.ArcaneRising)
      .withRarity(CARD_RARITIES.Common)
      .build();
    const card = cardBuilder().withPrintings([majesticPrinting, commonPrinting]).build();
    const cards = selectVisibleCards(
      stateBuilder()
        .withAllCards([card])
        .withRarities([CARD_RARITIES.Majestic, CARD_RARITIES.Common])
        .withGroupPrintings(true)
        .build(),
    );
    expect(cards[0].printings).toHaveLength(1);
    expect(cards[0].printings[0].rarity).toBe(CARD_RARITIES.Common);
  });

  test('Rule: When a single foiling is selected and multiple printings match, the oldest matching printing is shown', () => {
    const oldColdPrinting = printingBuilder()
      .withIdentifier('WTR001')
      .withPrint('WTR001-Cold')
      .withSet(CARD_SETS.WelcomeToRathe)
      .withFoiling(CARD_FOILINGS.Cold)
      .build();
    const newColdPrinting = printingBuilder()
      .withIdentifier('ARC001')
      .withPrint('ARC001-Cold')
      .withSet(CARD_SETS.ArcaneRising)
      .withFoiling(CARD_FOILINGS.Cold)
      .build();
    const card = cardBuilder().withPrintings([newColdPrinting, oldColdPrinting]).build();
    const cards = selectVisibleCards(
      stateBuilder()
        .withAllCards([card])
        .withFoilings([CARD_FOILINGS.Cold])
        .withGroupPrintings(true)
        .build(),
    );
    expect(cards[0].printings).toHaveLength(1);
    expect(cards[0].printings[0].identifier).toBe('WTR001');
  });

  test('Rule: When grouping is enabled and the foiling filter only matches the back printing, the card is not shown', () => {
    const back = printingBuilder({
      identifier: 'WTR001',
      print: 'WTR001-Cold-Back',
      foiling: CARD_FOILINGS.Cold,
    }).build();
    const front = printingBuilder({
      identifier: 'WTR001',
      print: 'WTR001',
      foiling: CARD_FOILINGS.Regular,
      backPrinting: back,
    }).build();
    const card = cardBuilder().withPrintings([front, back]).build();
    const cards = selectVisibleCards(
      stateBuilder()
        .withAllCards([card])
        .withFoilings([CARD_FOILINGS.Cold])
        .withGroupPrintings(true)
        .build(),
    );
    expect(cards).toHaveLength(0);
  });

  test('Rule: When grouping is enabled, a card with multiple printings is shown once with the oldest printing', () => {
    const arcPrinting = printingBuilder()
      .withIdentifier('ARC001')
      .withPrint('ARC001')
      .withSet(CARD_SETS.ArcaneRising)
      .build();
    const card = cardBuilder().withPrintings([arcPrinting, wtrPrinting]).build();
    const cards = selectVisibleCards(
      stateBuilder().withAllCards([card]).withGroupPrintings(true).build(),
    );
    expect(cards[0].printings).toHaveLength(1);
    expect(cards[0].printings[0].set).toBe(CARD_SETS.WelcomeToRathe);
  });
});

describe('Feature: Sorting', () => {
  test('Rule: Sorts cards by set order, earlier sets first', () => {
    const wtrCard = cardBuilder()
      .withCardIdentifier('wtr-card')
      .withPrintings([
        printingBuilder({
          set: CARD_SETS.WelcomeToRathe,
          identifier: 'WTR001',
          print: 'WTR001',
        }).build(),
      ])
      .build();
    const promoCard = cardBuilder()
      .withCardIdentifier('promo-card')
      .withPrintings([
        printingBuilder({ set: CARD_SETS.Promos, identifier: 'LGS001', print: 'LGS001' }).build(),
      ])
      .build();
    const result = selectCardWithActivePrinting(
      stateBuilder().withAllCards([promoCard, wtrCard]).build(),
    );
    expect(result[0].card.cardIdentifier).toBe('wtr-card');
    expect(result[1].card.cardIdentifier).toBe('promo-card');
  });

  test('Rule: Preserves search relevance order instead of sorting by set when a query is active', () => {
    const wtrCard = cardBuilder()
      .withCardIdentifier('wtr-card')
      .withPrintings([
        printingBuilder({
          set: CARD_SETS.WelcomeToRathe,
          identifier: 'WTR001',
          print: 'WTR001',
        }).build(),
      ])
      .build();
    const promoCard = cardBuilder()
      .withCardIdentifier('promo-card')
      .withPrintings([
        printingBuilder({ set: CARD_SETS.Promos, identifier: 'LGS001', print: 'LGS001' }).build(),
      ])
      .build();

    const result = selectCardWithActivePrinting(
      stateBuilder().withSearchResults([promoCard, wtrCard]).withSearchQuery('some query').build(),
    );

    expect(result[0].card.cardIdentifier).toBe('promo-card');
    expect(result[1].card.cardIdentifier).toBe('wtr-card');
  });

  test('Rule: sorts later sets first when sort order is set DESC', () => {
    const welcomeToRathePrinting = cardBuilder()
      .withCardIdentifier('alpha-rampage-red')
      .withPrintings([printingBuilder().withSet(CARD_SETS.WelcomeToRathe).build()])
      .build();

    const arcaneRisingPrinting = cardBuilder()
      .withCardIdentifier('absorb-in-aether-red')
      .withPrintings([printingBuilder().withSet(CARD_SETS.ArcaneRising).build()])
      .build();

    const result = selectCardWithActivePrinting(
      stateBuilder()
        .withAllCards([welcomeToRathePrinting, arcaneRisingPrinting])
        .withSortOrder(SORT_ORDER.SET_DESC)
        .build(),
    );

    expect(result[0].card.cardIdentifier).toBe('absorb-in-aether-red');
    expect(result[1].card.cardIdentifier).toBe('alpha-rampage-red');
  });

  test('Rule: Sorts cards alphabetically A to Z when sort order is name ASC', () => {
    const cardA = cardBuilder()
      .withCardIdentifier('card-a')
      .withName('Zebra')
      .withPrintings([wtrPrinting])
      .build();
    const cardB = cardBuilder()
      .withCardIdentifier('card-b')
      .withName('Apple')
      .withPrintings([wtrPrinting])
      .build();

    const result = selectCardWithActivePrinting(
      stateBuilder().withAllCards([cardA, cardB]).withSortOrder(SORT_ORDER.NAME_ASC).build(),
    );

    expect(result[0].card.name).toBe('Apple');
    expect(result[1].card.name).toBe('Zebra');
  });

  test('Rule: Sorts cards alphabetically Z to A when sort order is name DESC', () => {
    const cardA = cardBuilder()
      .withCardIdentifier('card-a')
      .withName('Apple')
      .withPrintings([wtrPrinting])
      .build();
    const cardB = cardBuilder()
      .withCardIdentifier('card-b')
      .withName('Zebra')
      .withPrintings([wtrPrinting])
      .build();

    const result = selectCardWithActivePrinting(
      stateBuilder().withAllCards([cardA, cardB]).withSortOrder(SORT_ORDER.NAME_DESC).build(),
    );

    expect(result[0].card.name).toBe('Zebra');
    expect(result[1].card.name).toBe('Apple');
  });

  test('Rule: Sorts printings within the same card by identifier', () => {
    const printingA = printingBuilder({
      set: CARD_SETS.WelcomeToRathe,
      identifier: 'WTR001',
      print: 'WTR001-A',
    }).build();
    const printingB = printingBuilder({
      set: CARD_SETS.WelcomeToRathe,
      identifier: 'WTR002',
      print: 'WTR002-B',
    }).build();
    const card = cardBuilder().withPrintings([printingB, printingA]).build();
    const cards = selectVisibleCards(stateBuilder().withAllCards([card]).build());
    expect(cards[0].printings[0].identifier).toBe('WTR001');
    expect(cards[0].printings[1].identifier).toBe('WTR002');
  });
});

describe('Feature: Card printings grid ordering', () => {
  test('Rule: With set-asc sort, printings from all cards are interleaved by printing set, not grouped by card', () => {
    const arcPrinting = printingBuilder()
      .withIdentifier('ARC001')
      .withPrint('ARC001')
      .withSet(CARD_SETS.ArcaneRising)
      .build();
    const ira = cardBuilder()
      .withCardIdentifier('ira')
      .withPrintings([wtrPrinting, arcPrinting])
      .build();
    const other = cardBuilder().withCardIdentifier('other').withPrintings([wtrPrinting]).build();

    const result = selectCardWithActivePrinting(
      stateBuilder().withAllCards([ira, other]).withSortOrder(SORT_ORDER.SET_ASC).build(),
    );

    expect(result[0].card.cardIdentifier).toBe('ira');
    expect(result[0].printing.set).toBe(CARD_SETS.WelcomeToRathe);
    expect(result[1].card.cardIdentifier).toBe('other');
    expect(result[1].printing.set).toBe(CARD_SETS.WelcomeToRathe);
    expect(result[2].card.cardIdentifier).toBe('ira');
    expect(result[2].printing.set).toBe(CARD_SETS.ArcaneRising);
  });
});
