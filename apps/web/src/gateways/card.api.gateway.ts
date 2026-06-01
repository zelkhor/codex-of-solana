import type { CardDto, Result } from '@codex/shared';
import { ok, err, AppError } from '@codex/shared';
import type { ICardGateway } from '@/gateways/card.gateway';

export class CardApiGateway implements ICardGateway {
  async getAll(): Promise<Result<CardDto[], AppError>> {
    try {
      const response = await fetch('/api/cards');
      if (!response.ok)
        return err(new AppError('CARD_API_ERROR', `Failed to fetch cards: ${response.status}`));
      return ok((await response.json()) as CardDto[]);
    } catch (e) {
      return err(
        new AppError('CARD_NETWORK_ERROR', e instanceof Error ? e.message : 'Network error'),
      );
    }
  }
}
