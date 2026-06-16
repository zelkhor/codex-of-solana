import type { Result } from '../../../shared/helpers/result';
import type { Card } from '../../domain/card';
import type { ICardCatalogRepository } from '../card-catalog.repository';

export class GetAllCardsUseCase {
  constructor(private readonly repository: ICardCatalogRepository) {}

  execute(): Promise<Result<Card[]>> {
    return this.repository.getAll();
  }
}
