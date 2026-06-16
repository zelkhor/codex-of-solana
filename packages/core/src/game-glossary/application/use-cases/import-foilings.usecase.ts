import { type Result, err } from '../../../shared/helpers/result';
import { Foiling } from '../../domain/foiling';
import type { IFoilingRepository } from '../foiling.repository';

export type ImportFoilingsCommand = {
  names: string[];
};

export class ImportFoilingsUseCase {
  constructor(private readonly repository: IFoilingRepository) {}

  async execute(command: ImportFoilingsCommand): Promise<Result<void>> {
    const foilings: Foiling[] = [];

    for (const name of command.names) {
      const result = Foiling.create(name);
      if (!result.ok) return err(result.error);
      foilings.push(result.value);
    }

    return this.repository.saveAll(foilings);
  }
}
