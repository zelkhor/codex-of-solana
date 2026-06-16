import { type Result, err } from '../../../shared/helpers/result';
import { Edition } from '../../domain/edition';
import type { IEditionRepository } from '../edition.repository';

export type ImportEditionsCommand = {
  names: string[];
};

export class ImportEditionsUseCase {
  constructor(private readonly repository: IEditionRepository) {}

  async execute(command: ImportEditionsCommand): Promise<Result<void>> {
    const editions: Edition[] = [];

    for (const name of command.names) {
      const result = Edition.create(name);
      if (!result.ok) return err(result.error);
      editions.push(result.value);
    }

    return this.repository.saveAll(editions);
  }
}
