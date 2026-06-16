import { type Result, err } from '../../../shared/helpers/result';
import { Type } from '../../domain/type';
import type { ITypeRepository } from '../type.repository';

export type ImportTypesCommand = {
  names: string[];
};

export class ImportTypesUsecase {
  constructor(private readonly repository: ITypeRepository) {}

  async execute(command: ImportTypesCommand): Promise<Result<void>> {
    const types: Type[] = [];

    for (const name of command.names) {
      const result = Type.create(name);
      if (!result.ok) return err(result.error);
      types.push(result.value);
    }

    return this.repository.saveAll(types);
  }
}
