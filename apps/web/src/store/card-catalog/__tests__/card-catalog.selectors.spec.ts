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
} from '@codex/core';
import { selectVisiblePrintings } from '../card-catalog.selectors';
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

describe('Feature: Card-level filtering', () => {
  test('Rule: returns all printings when no filters are active', () => {
    const card = cardBuilder().withPrintings([wtrPrinting, promoPrinting]).build();
    const allPrintings = selectVisiblePrintings(stateBuilder().withAllCards([card]).build());
    expect(allPrintings).toHaveLength(2);
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
    const slots = selectVisiblePrintings(
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
    const slots = selectVisiblePrintings(
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
    const slots = selectVisiblePrintings(
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
    const slots = selectVisiblePrintings(
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
    const slots = selectVisiblePrintings(
      stateBuilder().withAllCards([card]).withSets([CARD_SETS.WelcomeToRathe]).build(),
    );
    expect(slots).toHaveLength(1);
    expect(slots[0].printing.set).toBe(CARD_SETS.WelcomeToRathe);
  });

  test('Rule: excludes all printings when the set filter does not match any', () => {
    const card = cardBuilder().withPrintings([wtrPrinting]).build();
    const slots = selectVisiblePrintings(
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
    const slots = selectVisiblePrintings(
      stateBuilder().withAllCards([card]).withRarities([CARD_RARITIES.Rare]).build(),
    );
    expect(slots).toHaveLength(1);
    expect(slots[0].printing.rarity).toBe(CARD_RARITIES.Rare);
  });

  test('Rule: excludes all printings when the rarity filter does not match any', () => {
    const card = cardBuilder().withPrintings([wtrPrinting]).build();
    const slots = selectVisiblePrintings(
      stateBuilder().withAllCards([card]).withRarities([CARD_RARITIES.Marvel]).build(),
    );
    expect(slots).toHaveLength(0);
  });

  test('Rule: includes only printings with the selected foiling', () => {
    const rainbowPrinting = printingBuilder({
      identifier: 'WTR001-RF',
      print: 'WTR001-RF',
      foiling: CARD_FOILINGS.Rainbow,
    }).build();
    const card = cardBuilder().withPrintings([wtrPrinting, rainbowPrinting]).build();
    const slots = selectVisiblePrintings(
      stateBuilder().withAllCards([card]).withFoilings([CARD_FOILINGS.Rainbow]).build(),
    );
    expect(slots).toHaveLength(1);
    expect(slots[0].printing.foiling).toBe(CARD_FOILINGS.Rainbow);
  });

  test('Rule: excludes all printings when the foiling filter does not match any', () => {
    const card = cardBuilder().withPrintings([wtrPrinting]).build();
    const slots = selectVisiblePrintings(
      stateBuilder().withAllCards([card]).withFoilings([CARD_FOILINGS.Cold]).build(),
    );
    expect(slots).toHaveLength(0);
  });

  test('Rule: includes a slot when the rarity filter matches the back printing but not the front', () => {
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
    const slots = selectVisiblePrintings(
      stateBuilder().withAllCards([card]).withRarities([CARD_RARITIES.Marvel]).build(),
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
    const slots = selectVisiblePrintings(stateBuilder().withAllCards([card]).build());
    expect(slots).toHaveLength(1);
    expect(slots[0].printing.print).toBe('HNT264-Cold');
  });

  test('Rule: pairs a front with its back printing', () => {
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
    const slots = selectVisiblePrintings(stateBuilder().withAllCards([card]).build());
    expect(slots[0].backPrinting).toEqual(back);
  });

  test('Rule: front printing with no backPrinting has no back slot', () => {
    const tokenFront = printingBuilder({
      identifier: 'MST002',
      print: 'MST002',
      foiling: undefined,
      rarity: CARD_RARITIES.Token,
    }).build();
    const card = cardBuilder().withPrintings([tokenFront]).build();
    const slots = selectVisiblePrintings(stateBuilder().withAllCards([card]).build());
    expect(slots[0].backPrinting).toBeUndefined();
  });

  test('Rule: back printing is available even when the back card is not in search results', () => {
    const back = printingBuilder({ print: 'MST010-Back' }).build();
    const front = printingBuilder({ print: 'MST010', backPrinting: back }).build();
    const frontCard = cardBuilder().withPrintings([front]).build();
    const slots = selectVisiblePrintings(stateBuilder().withSearchResults([frontCard]).build());
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
    const slots = selectVisiblePrintings(stateBuilder().withAllCards([promoCard, wtrCard]).build());
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
    const slots = selectVisiblePrintings(stateBuilder().withAllCards([card]).build());
    expect(slots[0].printing.identifier).toBe('WTR001');
    expect(slots[1].printing.identifier).toBe('WTR002');
  });
});
