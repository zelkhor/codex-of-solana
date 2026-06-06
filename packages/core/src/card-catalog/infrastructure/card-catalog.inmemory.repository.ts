import { type Result, ok } from '../../shared/result';
import type { ICardCatalogRepository } from '../application/card-catalog.repository';
import type { Card } from '../domain/card';
import type { CardCatalogLoadError } from '../domain/card-catalog.errors';

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
