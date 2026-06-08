import type { Result } from '../../shared/helpers/result';
import type { Class } from '../domain/class';

export interface IClassRepository {
  findAll(): Promise<Result<Class[]>>;
  saveAll(classes: Class[]): Promise<Result<void>>;
}
