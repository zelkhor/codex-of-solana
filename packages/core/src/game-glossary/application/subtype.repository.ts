import type { Result } from '../../shared/helpers/result';
import type { Subtype } from '../domain/subtype';

export interface ISubtypeRepository {
  findAll(): Promise<Result<Subtype[]>>;
  saveAll(subtypes: Subtype[]): Promise<Result<void>>;
}
