import type { Result } from '../../shared/helpers/result';
import type { SetGroup } from '../domain/set-group';

export interface ISetGroupRepository {
  findAll(): Promise<Result<SetGroup[]>>;
  save(group: SetGroup): Promise<Result<void>>;
}
