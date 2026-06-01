import type { CardDto, Result } from '@codex/shared';
import type { CardCatalogLoadError } from '../domain/card-catalog.errors';

export interface ICardCatalogRepository {
  getAll(): Promise<Result<CardDto[], CardCatalogLoadError>>;
}
