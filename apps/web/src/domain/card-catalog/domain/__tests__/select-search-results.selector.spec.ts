import { beforeEach, describe, test } from 'vitest';

import { cardBuilder } from '@codex/core/testing';

import {
  type CardCatalogSelectorsFixture,
  createCardCatalogSelectorsFixture,
} from '@/domain/card-catalog/domain/__tests__/card-catalog.selectors.fixture.ts';
import { stateBuilderProvider } from '@/domain/store/__tests__/state.builder.ts';

describe('Feature: Selecting the cards shown for the current search', () => {
  let fixture: CardCatalogSelectorsFixture;

  beforeEach(() => {
    fixture = createCardCatalogSelectorsFixture(stateBuilderProvider());
  });

  test('Rule: With no active search, every loaded card is shown', () => {
    const ninja = cardBuilder().withCardIdentifier('ninja').build();
    const brute = cardBuilder().withCardIdentifier('brute').build();
    fixture.givenCards([ninja, brute]);
    fixture.givenSearchMatched(null);

    fixture.thenSearchResultsShouldBe([ninja, brute]);
  });

  test('Rule: With an active search, only the matched cards are shown, in match order', () => {
    const ninja = cardBuilder().withCardIdentifier('ninja').build();
    const brute = cardBuilder().withCardIdentifier('brute').build();
    fixture.givenCards([ninja, brute]);
    fixture.givenSearchMatched(['brute', 'ninja']);

    fixture.thenSearchResultsShouldBe([brute, ninja]);
  });

  test('Rule: A matched identifier with no corresponding card is ignored', () => {
    const ninja = cardBuilder().withCardIdentifier('ninja').build();
    fixture.givenCards([ninja]);
    fixture.givenSearchMatched(['ninja', 'no-such-card']);

    fixture.thenSearchResultsShouldBe([ninja]);
  });
});
