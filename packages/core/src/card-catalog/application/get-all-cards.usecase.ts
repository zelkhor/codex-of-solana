import type { CardDto, Result } from '@codex/shared';
import type { ICardCatalogRepository } from './card-catalog.repository';
import type { CardCatalogLoadError } from '../domain/card-catalog.errors';

export class GetAllCardsUseCase {
  constructor(private readonly repository: ICardCatalogRepository) {}

  execute(): Promise<Result<CardDto[], CardCatalogLoadError>> {
    return this.repository.getAll();
  }
}
