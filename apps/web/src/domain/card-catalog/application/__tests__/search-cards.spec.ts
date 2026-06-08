import { beforeEach, describe, test } from 'vitest';

import { cardBuilder } from '@codex/core/testing';

import {
  type CardCatalogFixture,
  createCardCatalogFixture,
} from '@/domain/card-catalog/application/__tests__/card-catalog.fixture.ts';

describe('Feature: When searching cards', () => {
  let fixture: CardCatalogFixture;

  beforeEach(() => {
    fixture = createCardCatalogFixture();
  });

  test('Rule: It should only show cards matching the search query', async () => {
    const ninjaStrike = cardBuilder()
      .withCardIdentifier('ninja-strike-red')
      .withName('Ninja Strike')
      .build();
    const bruteForce = cardBuilder()
      .withCardIdentifier('brute-force-red')
      .withName('Brute Force')
      .build();
    fixture.givenAvailableCards([ninjaStrike, bruteForce]);

    await fixture.whenGettingCards();

    fixture.whenSearchingCards('ninja');
    fixture.thenSearchResultsShouldBe([ninjaStrike]);
  });

  test('Rule: It should restore the full catalog when the search is cleared', async () => {
    const alpha = cardBuilder().withCardIdentifier('card-a').withName('Alpha').build();
    const beta = cardBuilder().withCardIdentifier('card-b').withName('Beta').build();
    fixture.givenAvailableCards([alpha, beta]);

    await fixture.whenGettingCards();

    fixture.whenSearchingCards('alpha');
    fixture.thenSearchResultsShouldBe([alpha]);

    fixture.whenSearchingCards('');
    fixture.thenSearchResultsShouldBe([alpha, beta]);
  });
});
