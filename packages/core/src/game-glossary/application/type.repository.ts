import type { Result } from '../../shared/helpers/result';
import type { Type } from '../domain/type';

export interface ITypeRepository {
  findAll(): Promise<Result<Type[]>>;
  saveAll(types: Type[]): Promise<Result<void>>;
}
