import type { CardDto, Result } from '@codex/shared';
import { ok, err, AppError } from '@codex/shared';
import type { ICardGateway } from '@/gateways/card.gateway';

export class CardInMemoryGateway implements ICardGateway {
  constructor(
    private readonly cards: CardDto[] = [],
    private readonly simulatedError?: string,
  ) {}

  async getAll(): Promise<Result<CardDto[], AppError>> {
    if (this.simulatedError) return err(new AppError('CARD_SIMULATED_ERROR', this.simulatedError));
    return ok(this.cards);
  }
}
