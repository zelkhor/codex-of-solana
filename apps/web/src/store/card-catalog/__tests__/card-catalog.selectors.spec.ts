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
  CARD_KEYWORDS,
} from '@codex/shared';
import { selectGroupedGridSlots, selectImageIndex } from '../card-catalog.selectors';
import { stateBuilder } from '@/store/__tests__/state.builder';

// ─── Printing shortcuts ───────────────────────────────────────────────────────

const wtrPrinting = printingBuilder({
  identifier: 'WTR001',
  print: 'WTR001',
  set: CARD_SETS.WelcomeToRathe,
  rarity: CARD_RARITIES.Common,
}).build();

const promoPrinting = printingBuilder({
  identifier: 'LGS001',
  print: 'LGS001-Rainbow',
  set: CARD_SETS.Promos,
  rarity: CARD_RARITIES.Common,
}).build();

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Feature: Image index', () => {
  test('Rule: builds an empty index when there are no cards', () => {
    const index = selectImageIndex(stateBuilder().build());
    expect(index.size).toBe(0);
  });

  test('Rule: indexes each printing by its image value', () => {
    const printing = printingBuilder({ image: 'WTR001' }).build();
    const card = cardBuilder().withPrintings([printing]).build();
    const index = selectImageIndex(stateBuilder().withAllCards([card]).build());
    expect(index.get('WTR001')).toEqual(printing);
  });
});

describe('Feature: Card-level filtering', () => {
  test('Rule: returns all printings when no filters are active', () => {
    const card = cardBuilder().withPrintings([wtrPrinting, promoPrinting]).build();
    const slots = selectGroupedGridSlots(stateBuilder().withAllCards([card]).build());
    expect(slots).toHaveLength(2);
  });

  test('Rule: excludes cards that do not match the class filter', () => {
    const matching = cardBuilder()
      .withCardIdentifier('a')
      .withClasses([CARD_CLASSES.Generic])
      .build();
    const excluded = cardBuilder()
      .withCardIdentifier('b')
      .withClasses([CARD_CLASSES.Warrior])
      .build();
    const slots = selectGroupedGridSlots(
      stateBuilder().withAllCards([matching, excluded]).withClasses([CARD_CLASSES.Generic]).build(),
    );
    expect(slots).toHaveLength(1);
    expect(slots[0].card.cardIdentifier).toBe('a');
  });

  test('Rule: excludes cards that do not match the talent filter', () => {
    const matching = cardBuilder()
      .withCardIdentifier('a')
      .withTalents([CARD_TALENTS.Shadow])
      .build();
    const excluded = cardBuilder().withCardIdentifier('b').withTalents([]).build();
    const slots = selectGroupedGridSlots(
      stateBuilder().withAllCards([matching, excluded]).withTalents([CARD_TALENTS.Shadow]).build(),
    );
    expect(slots).toHaveLength(1);
    expect(slots[0].card.cardIdentifier).toBe('a');
  });

  test('Rule: excludes cards that do not match the type filter', () => {
    const matching = cardBuilder().withCardIdentifier('a').withTypes([CARD_TYPES.Action]).build();
    const excluded = cardBuilder()
      .withCardIdentifier('b')
      .withTypes([CARD_TYPES.Equipment])
      .build();
    const slots = selectGroupedGridSlots(
      stateBuilder().withAllCards([matching, excluded]).withTypes([CARD_TYPES.Action]).build(),
    );
    expect(slots).toHaveLength(1);
    expect(slots[0].card.cardIdentifier).toBe('a');
  });

  test('Rule: excludes cards that do not match the keyword filter', () => {
    const matching = cardBuilder()
      .withCardIdentifier('a')
      .withKeywords([CARD_KEYWORDS.Dominate])
      .build();
    const excluded = cardBuilder().withCardIdentifier('b').withKeywords([]).build();
    const slots = selectGroupedGridSlots(
      stateBuilder()
        .withAllCards([matching, excluded])
        .withKeywords([CARD_KEYWORDS.Dominate])
        .build(),
    );
    expect(slots).toHaveLength(1);
    expect(slots[0].card.cardIdentifier).toBe('a');
  });
});

describe('Feature: Printing-level filtering', () => {
  test('Rule: includes only printings from the selected set', () => {
    const card = cardBuilder().withPrintings([wtrPrinting, promoPrinting]).build();
    const slots = selectGroupedGridSlots(
      stateBuilder().withAllCards([card]).withSets([CARD_SETS.WelcomeToRathe]).build(),
    );
    expect(slots).toHaveLength(1);
    expect(slots[0].printing.set).toBe(CARD_SETS.WelcomeToRathe);
  });

  test('Rule: excludes all printings when the set filter does not match any', () => {
    const card = cardBuilder().withPrintings([wtrPrinting]).build();
    const slots = selectGroupedGridSlots(
      stateBuilder().withAllCards([card]).withSets([CARD_SETS.Promos]).build(),
    );
    expect(slots).toHaveLength(0);
  });

  test('Rule: includes only printings with the selected rarity', () => {
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
    const slots = selectGroupedGridSlots(
      stateBuilder().withAllCards([card]).withRarities([CARD_RARITIES.Rare]).build(),
    );
    expect(slots).toHaveLength(1);
    expect(slots[0].printing.rarity).toBe(CARD_RARITIES.Rare);
  });

  test('Rule: excludes all printings when the rarity filter does not match any', () => {
    const card = cardBuilder().withPrintings([wtrPrinting]).build();
    const slots = selectGroupedGridSlots(
      stateBuilder().withAllCards([card]).withRarities([CARD_RARITIES.Marvel]).build(),
    );
    expect(slots).toHaveLength(0);
  });

  test('Rule: includes a slot when the rarity filter matches the back printing but not the front', () => {
    const front = printingBuilder({
      identifier: 'MST010',
      print: 'MST010',
      rarity: CARD_RARITIES.Majestic,
      image: 'MST010',
      oppositeImage: 'MST010_BACK',
    }).build();
    const back = printingBuilder({
      identifier: 'MST010',
      print: 'MST010-Back',
      rarity: CARD_RARITIES.Marvel,
      image: 'MST010_BACK',
    }).build();
    const frontCard = cardBuilder().withCardIdentifier('front').withPrintings([front]).build();
    const backCard = cardBuilder().withCardIdentifier('back').withPrintings([back]).build();
    const slots = selectGroupedGridSlots(
      stateBuilder()
        .withAllCards([frontCard, backCard])
        .withRarities([CARD_RARITIES.Marvel])
        .build(),
    );
    expect(slots).toHaveLength(1);
    expect(slots[0].printing.rarity).toBe(CARD_RARITIES.Majestic);
    expect(slots[0].backPrinting?.rarity).toBe(CARD_RARITIES.Marvel);
  });
});

describe('Feature: Double-sided card pairing', () => {
  test('Rule: back printings (-Back) are not emitted as their own slots', () => {
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
    const slots = selectGroupedGridSlots(stateBuilder().withAllCards([card]).build());
    expect(slots).toHaveLength(1);
    expect(slots[0].printing.print).toBe('HNT264-Cold');
  });

  test('Rule: pairs a front with its same-card -Back printing when foiling matches', () => {
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
    const slots = selectGroupedGridSlots(stateBuilder().withAllCards([card]).build());
    expect(slots[0].backPrinting).toEqual(back);
  });

  test('Rule: does not pair a front with a -Back of a different foiling', () => {
    const tokenFront = printingBuilder({
      identifier: 'MST002',
      print: 'MST002',
      foiling: undefined,
      rarity: CARD_RARITIES.Token,
    }).build();
    const coldBack = printingBuilder({
      identifier: 'MST002',
      print: 'MST002-Cold-Full Art-Back',
      foiling: CARD_FOILINGS.Cold,
    }).build();
    const card = cardBuilder().withPrintings([tokenFront, coldBack]).build();
    const slots = selectGroupedGridSlots(stateBuilder().withAllCards([card]).build());
    const tokenSlot = slots.find((s) => s.printing.print === 'MST002');
    expect(tokenSlot?.backPrinting).toBeUndefined();
  });

  test('Rule: pairs a front with its cross-card back via oppositeImage', () => {
    const front = printingBuilder({
      image: 'MST010',
      oppositeImage: 'MST010_BACK',
      print: 'MST010',
      rarity: CARD_RARITIES.Majestic,
    }).build();
    const back = printingBuilder({
      image: 'MST010_BACK',
      print: 'MST010-Back',
      rarity: CARD_RARITIES.Majestic,
    }).build();
    const frontCard = cardBuilder().withCardIdentifier('front').withPrintings([front]).build();
    const backCard = cardBuilder().withCardIdentifier('back').withPrintings([back]).build();
    const slots = selectGroupedGridSlots(
      stateBuilder().withAllCards([frontCard, backCard]).build(),
    );
    expect(slots).toHaveLength(1);
    expect(slots[0].backPrinting).toEqual(back);
  });

  test('Rule: resolves cross-card back from allCards even when back card is not in searchResults', () => {
    const front = printingBuilder({
      image: 'MST010',
      oppositeImage: 'MST010_BACK',
      print: 'MST010',
    }).build();
    const back = printingBuilder({ image: 'MST010_BACK', print: 'MST010-Back' }).build();
    const frontCard = cardBuilder().withCardIdentifier('front').withPrintings([front]).build();
    const backCard = cardBuilder().withCardIdentifier('back').withPrintings([back]).build();
    const slots = selectGroupedGridSlots(
      stateBuilder().withAllCards([frontCard, backCard]).withSearchResults([frontCard]).build(),
    );
    expect(slots[0].backPrinting).toEqual(back);
  });
});

describe('Feature: Grid slot sorting', () => {
  test('Rule: sorts slots by set order, earlier sets first', () => {
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
    const slots = selectGroupedGridSlots(stateBuilder().withAllCards([promoCard, wtrCard]).build());
    expect(slots[0].card.cardIdentifier).toBe('wtr-card');
    expect(slots[1].card.cardIdentifier).toBe('promo-card');
  });

  test('Rule: sorts slots by identifier within the same set', () => {
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
    const slots = selectGroupedGridSlots(stateBuilder().withAllCards([card]).build());
    expect(slots[0].printing.identifier).toBe('WTR001');
    expect(slots[1].printing.identifier).toBe('WTR002');
  });
});
