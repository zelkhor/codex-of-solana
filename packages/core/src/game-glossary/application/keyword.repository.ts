import type { Result } from '../../shared/helpers/result';
import type { Keyword } from '../domain/keyword';

export interface IKeywordRepository {
  findAll(): Promise<Result<Keyword[]>>;
  saveAll(keywords: Keyword[]): Promise<Result<void>>;
}
