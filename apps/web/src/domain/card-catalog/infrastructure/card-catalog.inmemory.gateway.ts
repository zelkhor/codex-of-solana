import type { Card, Result } from '@codex/core';
import { ok, err, AppError } from '@codex/core';
import type { ICardCatalogGateway } from '@/domain/card-catalog/infrastructure/card-catalog.gateway.ts';

export class InMemoryCardCatalogGateway implements ICardCatalogGateway {
  private cards = new Map<string, Card>();
  private simulatedError?: string;

  async getCards(): Promise<Result<Card[], AppError>> {
    if (this.simulatedError) return err(new AppError('CARD_SIMULATED_ERROR', this.simulatedError));
    return ok([...this.cards.values()]);
  }

  setCards(cards: Card[]) {
    cards.forEach((card) => {
      this.cards.set(card.cardIdentifier, card);
    });
  }

  simulateError(error: string) {
    this.simulatedError = error;
  }
}
