import type { ICardCatalogRepository } from './card-catalog.repository';
import type { CardCatalogLoadError } from '../domain/card-catalog.errors';
import type { Result } from '../../shared/result';
import type { Card } from '../domain/card';

export class GetAllCardsUseCase {
  constructor(private readonly repository: ICardCatalogRepository) {}

  execute(): Promise<Result<Card[], CardCatalogLoadError>> {
    return this.repository.getAll();
  }
}
