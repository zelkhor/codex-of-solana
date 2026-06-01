import type { CardDto, Result } from '@codex/shared';
import { ok } from '@codex/shared';
import type { ICardCatalogRepository } from '../application/card-catalog.repository';
import type { CardCatalogLoadError } from '../domain/card-catalog.errors';

export class CardCatalogInMemoryRepository implements ICardCatalogRepository {
  private cards: CardDto[] = [];

  withCards(cards: CardDto[]): this {
    this.cards = cards;
    return this;
  }

  async getAll(): Promise<Result<CardDto[], CardCatalogLoadError>> {
    return ok(this.cards);
  }
}
