import { type Result, err } from '../../../shared/helpers/result';
import { GroupAlreadyExistsError, SetGroup } from '../../domain/set-group';
import type { ISetGroupRepository } from '../set-group.repository';

export type CreateSetGroupCommand = {
  name: string;
};

export class CreateSetGroupUseCase {
  constructor(private readonly repository: ISetGroupRepository) {}

  async execute(command: CreateSetGroupCommand): Promise<Result<void>> {
    const created = SetGroup.create(command.name);
    if (!created.ok) return err(created.error);
    const group = created.value;

    const existing = await this.repository.findAll();
    if (!existing.ok) return existing;

    const alreadyExists = existing.value.some(
      (other) => other.name.toLowerCase() === group.name.toLowerCase(),
    );
    if (alreadyExists) return err(new GroupAlreadyExistsError(group.name));

    return this.repository.save(group);
  }
}
