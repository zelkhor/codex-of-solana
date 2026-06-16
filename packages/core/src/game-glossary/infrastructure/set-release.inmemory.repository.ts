import { type Result, ok } from '../../shared/helpers/result';
import type { ISetReleaseRepository } from '../application/set-release.repository';
import type { SetRelease } from '../domain/set-release';

export class InMemorySetReleaseRepository implements ISetReleaseRepository {
  private sets = new Map<string, SetRelease>();

  setSetReleases(sets: SetRelease[]): this {
    this.sets = new Map(sets.map((set) => [set.name, set]));
    return this;
  }

  async findAll(): Promise<Result<SetRelease[]>> {
    return ok([...this.sets.values()]);
  }

  async saveAll(sets: SetRelease[]): Promise<Result<void>> {
    sets.forEach((set) => this.sets.set(set.name, set));
    return ok(undefined);
  }
}
