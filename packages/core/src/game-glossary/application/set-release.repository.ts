import type { Result } from '../../shared/helpers/result';
import type { SetRelease } from '../domain/set-release';

export interface ISetReleaseRepository {
  findAll(): Promise<Result<SetRelease[]>>;
  saveAll(sets: SetRelease[]): Promise<Result<void>>;
}
