import { type Result, err } from '../../../shared/helpers/result';
import { Subtype } from '../../domain/subtype';
import type { ISubtypeRepository } from '../subtype.repository';

export type ImportSubtypesCommand = {
  names: string[];
};

export class ImportSubtypesUseCase {
  constructor(private readonly repository: ISubtypeRepository) {}

  async execute(command: ImportSubtypesCommand): Promise<Result<void>> {
    const subtypes: Subtype[] = [];

    for (const name of command.names) {
      const result = Subtype.create(name);
      if (!result.ok) return err(result.error);
      subtypes.push(result.value);
    }

    return this.repository.saveAll(subtypes);
  }
}
