import type { Result } from '../../shared/helpers/result';
import type { Talent } from '../domain/talent';

export interface ITalentRepository {
  findAll(): Promise<Result<Talent[]>>;
  saveAll(talents: Talent[]): Promise<Result<void>>;
}
