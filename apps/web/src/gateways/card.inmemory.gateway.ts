import type { Card, Result } from '@codex/core';
import { ok, err, AppError } from '@codex/core';
import type { ICardGateway } from '@/gateways/card.gateway';

export class InMemoryCardGateway implements ICardGateway {
  constructor(
    private readonly cards: Card[] = [],
    private readonly simulatedError?: string,
  ) {}

  async getAll(): Promise<Result<Card[], AppError>> {
    if (this.simulatedError) return err(new AppError('CARD_SIMULATED_ERROR', this.simulatedError));
    return ok(this.cards);
  }
}
