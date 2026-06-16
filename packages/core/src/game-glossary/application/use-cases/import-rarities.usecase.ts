import { type Result, err } from '../../../shared/helpers/result';
import { Rarity } from '../../domain/rarity';
import type { IRarityRepository } from '../rarity.repository';

export type ImportRaritiesCommand = {
  names: string[];
};

export class ImportRaritiesUseCase {
  constructor(private readonly repository: IRarityRepository) {}

  async execute(command: ImportRaritiesCommand): Promise<Result<void>> {
    const rarities: Rarity[] = [];

    for (const name of command.names) {
      const result = Rarity.create(name);
      if (!result.ok) return err(result.error);
      rarities.push(result.value);
    }

    return this.repository.saveAll(rarities);
  }
}
