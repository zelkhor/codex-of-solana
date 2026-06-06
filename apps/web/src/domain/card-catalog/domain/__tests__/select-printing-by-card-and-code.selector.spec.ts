import { beforeEach, describe, test } from 'vitest';

import { cardBuilder, printingBuilder } from '@codex/core';

import { stateBuilderProvider } from '@/shared/store/__tests__/state.builder.ts';

import {
  type CardCatalogSelectorsFixture,
  createCardCatalogSelectorsFixture,
} from '@/domain/card-catalog/domain/__tests__/card-catalog.selectors.fixture.ts';

describe('Feature: Looking up a printing by card and print code', () => {
  let fixture: CardCatalogSelectorsFixture;

  beforeEach(() => {
    fixture = createCardCatalogSelectorsFixture(stateBuilderProvider());
  });

  test('Rule: Returns the matching printing when the code exists', () => {
    const printing = printingBuilder().withPrint('WTR001').build();
    const card = cardBuilder().withCardIdentifier('some-card').withPrintings([printing]).build();
    fixture.givenCards([card]);
    fixture.thenPrintingByCardAndCodeShouldBe('some-card', 'WTR001', printing);
  });

  test('Rule: Falls back to the first printing when the code does not match', () => {
    const first = printingBuilder().withPrint('WTR001').build();
    const second = printingBuilder().withPrint('ARC001').build();
    const card = cardBuilder()
      .withCardIdentifier('some-card')
      .withPrintings([first, second])
      .build();
    fixture.givenCards([card]);
    fixture.thenPrintingByCardAndCodeShouldBe('some-card', 'UNKNOWN', first);
  });

  test('Rule: Returns undefined when the card does not exist', () => {
    fixture.givenCards([]);
    fixture.thenPrintingByCardAndCodeShouldBe('non-existent', 'WTR001', undefined);
  });
});
