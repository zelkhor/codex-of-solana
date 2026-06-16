import type { Result } from '../../shared/helpers/result';
import type { Treatment } from '../domain/treatment';

export interface ITreatmentRepository {
  findAll(): Promise<Result<Treatment[]>>;
  saveAll(treatments: Treatment[]): Promise<Result<void>>;
}
