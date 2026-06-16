import type { Result } from '../../shared/helpers/result';
import type { Card } from '../domain/card';

export interface ICardCatalogRepository {
  getAll(): Promise<Result<Card[]>>;
}
