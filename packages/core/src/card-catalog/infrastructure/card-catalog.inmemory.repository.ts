import type { ICardCatalogRepository } from '../application/card-catalog.repository';
import type { CardCatalogLoadError } from '../domain/card-catalog.errors';
import type { Card } from '../domain/card';
import { ok, type Result } from '../../shared/result';

export class CardCatalogInMemoryRepository implements ICardCatalogRepository {
  private cards: Card[] = [];

  withCards(cards: Card[]): this {
    this.cards = cards;
    return this;
  }

  async getAll(): Promise<Result<Card[], CardCatalogLoadError>> {
    return ok(this.cards);
  }
}
