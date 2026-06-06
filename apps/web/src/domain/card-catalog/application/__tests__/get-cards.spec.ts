import { describe, test, beforeEach } from 'vitest';
import { cardBuilder } from '@codex/core';
import { ASYNC_STATUS } from '@/shared/types/async-status.ts';
import {
  type CardCatalogFixture,
  createCardCatalogFixture,
} from '@/domain/card-catalog/application/__tests__/card-catalog.fixture.ts';

describe('Feature: When getting cards', () => {
  let fixture: CardCatalogFixture;

  beforeEach(() => {
    fixture = createCardCatalogFixture();
  });

  test('Rule: It should load all printed cards', async () => {
    const card = cardBuilder().withCardIdentifier('card-a').build();
    fixture.givenAvailableCards([card]);

    await fixture.whenGettingCards();

    fixture.thenCardsShouldBe([card]);
    fixture.thenStatusShouldBe(ASYNC_STATUS.SUCCEEDED);
  });

  test('Rule: It should report a failure when the cards could not be loaded', async () => {
    fixture.givenGatewayFails('Network error');

    await fixture.whenGettingCards();

    fixture.thenStatusShouldBe(ASYNC_STATUS.FAILED);
    fixture.thenErrorShouldBe('Network error');
  });
});
