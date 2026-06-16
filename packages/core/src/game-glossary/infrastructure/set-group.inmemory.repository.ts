import { type Result, ok } from '../../shared/helpers/result';
import type { ISetGroupRepository } from '../application/set-group.repository';
import type { SetGroup } from '../domain/set-group';

export class InMemorySetGroupRepository implements ISetGroupRepository {
  private groups = new Map<string, SetGroup>();

  setGroups(groups: SetGroup[]): this {
    this.groups = new Map(groups.map((group) => [group.name, group]));
    return this;
  }

  async findAll(): Promise<Result<SetGroup[]>> {
    return ok([...this.groups.values()]);
  }

  async save(group: SetGroup): Promise<Result<void>> {
    this.groups.set(group.name, group);
    return ok(undefined);
  }
}
