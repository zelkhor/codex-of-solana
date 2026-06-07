import { cardBuilder } from '../../../__tests__/builders/card.builder';
import { printingBuilder } from '../../../__tests__/builders/printing.builder';
import { CLASSES } from '../../../shared/game/class';
import { EDITIONS } from '../../../shared/game/edition';
import { FORMATS } from '../../../shared/game/format';
import { PITCH_VALUES } from '../../../shared/game/pitch';
import { RARITIES } from '../../../shared/game/rarity';
import { SETS } from '../../../shared/game/set';
import { TYPES } from '../../../shared/game/type';
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
      .withSet(SETS.ArcaneRising)
      .withRarity(RARITIES.Rare)
      .withEdition(EDITIONS.First)
      .withArtists(['Daria Cherkashina'])
      .withImage(`${IMAGE_BASE}ARC124.webp`)
      .build();

    const expectedCard = cardBuilder()
      .withCardIdentifier('absorb-in-aether-yellow')
      .withName('Absorb in Aether')
      .withPitch(PITCH_VALUES.Yellow)
      .withClasses([CLASSES.Wizard])
      .withTalents([])
      .withTypes([TYPES.DefenseReaction])
      .withSubtypes([])
      .withKeywords([])
      .withRarity(RARITIES.Rare)
      .withRarities([RARITIES.Rare])
      .withSets([SETS.ArcaneRising])
      .withTypeText('Wizard Defense Reaction')
      .withCost(1)
      .withAttack(null)
      .withDefense(3)
      .withIntellect(null)
      .withLife(null)
      .withLegalFormats([...Object.values(FORMATS)])
      .withLegalHeroes(['Blaze', 'Broscilio', 'Iyslander', 'Kano', 'Oscilio', 'Verdance'])
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
        .withSet(SETS.DuskTillDawn)
        .withRarity(RARITIES.Majestic)
        .withEdition(null)
        .withImage(`${IMAGE_BASE}DTD007.webp`)
        .withArtists(['Bastien Jez'])
        .withBackPrinting(null)
        .build(),
    );
  });
});
