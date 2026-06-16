import type { Result } from '../../shared/helpers/result';
import type { Foiling } from '../domain/foiling';

export interface IFoilingRepository {
  findAll(): Promise<Result<Foiling[]>>;
  saveAll(foilings: Foiling[]): Promise<Result<void>>;
}
