import type { Result } from '../../shared/helpers/result';
import type { Card } from '../domain/card';
import type { CardCatalogLoadError } from '../domain/card-catalog.errors';

export interface ICardCatalogRepository {
  getAll(): Promise<Result<Card[], CardCatalogLoadError>>;
}
