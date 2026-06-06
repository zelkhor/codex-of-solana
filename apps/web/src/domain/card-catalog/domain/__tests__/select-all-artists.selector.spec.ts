import { describe, test, beforeEach } from 'vitest';
import { cardBuilder, printingBuilder } from '@codex/core';
import { stateBuilderProvider } from '@/shared/store/__tests__/state.builder.ts';
import {
  createCardCatalogSelectorsFixture,
  type CardCatalogSelectorsFixture,
} from '@/domain/card-catalog/domain/__tests__/card-catalog.selectors.fixture.ts';

describe('Feature: Selecting all artists', () => {
  let fixture: CardCatalogSelectorsFixture;

  beforeEach(() => {
    fixture = createCardCatalogSelectorsFixture(stateBuilderProvider());
  });

  test('Rule: Returns an empty list when no cards are loaded', () => {
    fixture.givenCards([]);
    fixture.thenAllArtistsShouldBe([]);
  });

  test('Rule: Returns all unique artists sorted alphabetically across all printings', () => {
    const card = cardBuilder()
      .withPrintings([
        printingBuilder().withPrint('WTR001').withArtists(['Svetlin Velinov']).build(),
        printingBuilder().withPrint('ARC001').withArtists(['Micah Epstein']).build(),
      ])
      .build();
    fixture.givenCards([card]);

    fixture.thenAllArtistsShouldBe(['Micah Epstein', 'Svetlin Velinov']);
  });

  test('Rule: Deduplicates artists that appear across multiple printings', () => {
    const cardA = cardBuilder()
      .withCardIdentifier('a')
      .withPrintings([printingBuilder().withArtists(['Micah Epstein']).build()])
      .build();
    const cardB = cardBuilder()
      .withCardIdentifier('b')
      .withPrintings([printingBuilder().withArtists(['Micah Epstein']).build()])
      .build();
    fixture.givenCards([cardA, cardB]);

    fixture.thenAllArtistsShouldBe(['Micah Epstein']);
  });
});
