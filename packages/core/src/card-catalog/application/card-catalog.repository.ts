import type { CardCatalogLoadError } from '../domain/card-catalog.errors';
import type { Card } from '../domain/card';
import type { Result } from '../../shared/result';

export interface ICardCatalogRepository {
  getAll(): Promise<Result<Card[], CardCatalogLoadError>>;
}
