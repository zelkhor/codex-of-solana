import { cardBuilder } from '@codex/shared';
import { createCardCatalogFixture } from './card-catalog.fixture';

describe('Feature: Listing all cards', () => {
  test('Rule: It should list all the printed cards', async () => {
    const fixture = createCardCatalogFixture();
    const cards = [
      cardBuilder().withCardIdentifier('card-a').build(),
      cardBuilder().withCardIdentifier('card-b').build(),
    ];

    fixture.givenExistingCards(cards);
    await fixture.whenGettingAllCards();
    fixture.thenCardsShouldBe(cards);
  });

  test('Rule: It should return an empty list when the catalog has no cards', async () => {
    const fixture = createCardCatalogFixture();

    fixture.givenExistingCards([]);
    await fixture.whenGettingAllCards();
    fixture.thenCardsShouldBe([]);
  });
});
