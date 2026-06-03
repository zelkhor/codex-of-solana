import { expectOk } from '@codex/shared/src/testing/result.helpers';
import {
  IMAGE_BASE,
  cardBuilder,
  printingBuilder,
  CARD_SETS,
  CARD_RARITIES,
  CARD_EDITIONS,
  CARD_PITCHES,
  CARD_CLASSES,
  CARD_TYPES,
} from '@codex/shared';
import { CardCatalogFabRepository } from '../card-catalog.fab.repository';
import { CARD_PRINTING_OVERRIDES } from '../card-catalog.overrides';

describe('Feature: CardCatalogFabRepository', () => {
  let repository: CardCatalogFabRepository;

  beforeEach(() => {
    repository = new CardCatalogFabRepository();
  });

  test('Rule: getAll returns all FAB cards correctly mapped', async () => {
    const result = await repository.getAll();

    expectOk(result);
    expect(result.value.length).toBeGreaterThan(0);

    const expectedPrinting = printingBuilder()
      .withIdentifier('ARC124')
      .withPrint('ARC124-First')
      .withSet(CARD_SETS.ArcaneRising)
      .withRarity(CARD_RARITIES.Rare)
      .withEdition(CARD_EDITIONS.First)
      .withArtists(['Daria Cherkashina'])
      .withImage(`${IMAGE_BASE}ARC124.webp`)
      .build();

    const card = result.value.find((c) => c.cardIdentifier === 'absorb-in-aether-yellow');
    expect(card).toMatchObject({
      ...cardBuilder()
        .withCardIdentifier('absorb-in-aether-yellow')
        .withName('Absorb in Aether')
        .withPitch(CARD_PITCHES.Yellow)
        .withClasses([CARD_CLASSES.Wizard])
        .withTalents([])
        .withTypes([CARD_TYPES.DefenseReaction])
        .withSubtypes([])
        .withKeywords([])
        .withRarity(CARD_RARITIES.Rare)
        .withRarities([CARD_RARITIES.Rare])
        .withSets([CARD_SETS.ArcaneRising])
        .withTypeText('Wizard Defense Reaction')
        .withCost(1)
        .withAttack(null)
        .withDefense(3)
        .withIntellect(null)
        .withLife(null)
        .withFunctionalText(
          'The next card you play this turn with an effect that deals arcane damage, instead deals that much arcane damage plus 2.',
        )
        .withDefaultImage('ARC124')
        .build(),
      printings: expect.arrayContaining([expectedPrinting]),
    });
  });

  test('Rule: printing overrides are appended to the matching cards', async () => {
    const result = await repository.getAll();

    expectOk(result);
    for (const [cardIdentifier, extraPrintings] of Object.entries(CARD_PRINTING_OVERRIDES)) {
      const card = result.value.find((c) => c.cardIdentifier === cardIdentifier);
      expect(card).toBeDefined();
      for (const override of extraPrintings) {
        expect(card!.printings).toContainEqual(override);
      }
    }
  });

  test('Rule: All printings of a card should be unique', async () => {
    const result = await repository.getAll();

    expectOk(result);
    for (const card of result.value) {
      const prints = card.printings.map((p) => p.print);
      const unique = new Set(prints);
      expect(unique.size).toBe(prints.length);
    }
  });

  test('Rule: double-faced printings have their backPrinting resolved', async () => {
    const result = await repository.getAll();

    expectOk(result);
    const card = result.value.find((c) => c.cardIdentifier === 'aegis-archangel-of-protection');
    const printing = card?.printings.find((p) => p.print === 'DTD007-Back');
    expect(printing?.backPrinting).toMatchObject(
      printingBuilder()
        .withIdentifier('DTD007')
        .withPrint('DTD007')
        .withSet(CARD_SETS.DuskTillDawn)
        .withRarity(CARD_RARITIES.Majestic)
        .withEdition(null)
        .withImage(`${IMAGE_BASE}DTD007.webp`)
        .withArtists(['Bastien Jez'])
        .withBackPrinting(null)
        .build(),
    );
  });
});
