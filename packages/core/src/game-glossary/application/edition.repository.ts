import type { Result } from '../../shared/helpers/result';
import type { Edition } from '../domain/edition';

export interface IEditionRepository {
  findAll(): Promise<Result<Edition[]>>;
  saveAll(editions: Edition[]): Promise<Result<void>>;
}
