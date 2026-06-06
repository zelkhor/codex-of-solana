import { cardBuilder } from '../../../__tests__/builders/card.builder';
import { printingBuilder } from '../../../__tests__/builders/printing.builder';
import {
  CARD_CLASSES,
  CARD_EDITIONS,
  CARD_PITCHES,
  CARD_RARITIES,
  CARD_SETS,
  CARD_TYPES,
} from '../../domain/card';
import { IMAGE_BASE } from '../card-catalog.fab.repository';
import {
  type FabRepositoryFixture,
  createFabRepositoryFixture,
} from './card-catalog.fab.repository.fixture';

describe('Integration: CardCatalogFabRepository', () => {
  let fixture: FabRepositoryFixture;

  beforeEach(async () => {
    fixture = createFabRepositoryFixture();
  });

  test('Rule: getAll returns all FAB cards correctly mapped', async () => {
    await fixture.whenGettingAllCards();

    const expectedPrinting = printingBuilder()
      .withIdentifier('ARC124')
      .withPrint('ARC124-First')
      .withSet(CARD_SETS.ArcaneRising)
      .withRarity(CARD_RARITIES.Rare)
      .withEdition(CARD_EDITIONS.First)
      .withArtists(['Daria Cherkashina'])
      .withImage(`${IMAGE_BASE}ARC124.webp`)
      .build();

    const expectedCard = cardBuilder()
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
      .build();

    fixture.thenCatalogShouldNotBeEmpty();
    fixture.thenCardShouldMatch('absorb-in-aether-yellow', {
      ...expectedCard,
      printings: expect.arrayContaining([expectedPrinting]),
    });
  });

  test('Rule: printing overrides are appended to the matching cards', async () => {
    await fixture.whenGettingAllCards();

    fixture.thenPrintingOverridesShouldBePresent();
  });

  test('Rule: Unclassed cards have an empty classes array — NotClassed is removed', async () => {
    await fixture.whenGettingAllCards();

    fixture.thenSomeCardsHaveEmptyClasses();
  });

  test('Rule: All printings of a card should be unique', async () => {
    await fixture.whenGettingAllCards();

    fixture.thenAllPrintingsShouldBeUnique();
  });

  test('Rule: double-faced printings have their backPrinting resolved', async () => {
    await fixture.whenGettingAllCards();

    fixture.thenBackPrintingShouldMatch(
      'aegis-archangel-of-protection',
      'DTD007-Back',
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
