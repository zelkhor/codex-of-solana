import { type Result, err } from '../../shared/helpers/result';
import { Talent } from '../domain/talent';
import type { ITalentRepository } from './talent.repository';

export type ImportTalentsCommand = {
  names: string[];
};

export class ImportTalentsUseCase {
  constructor(private readonly repository: ITalentRepository) {}

  async execute(command: ImportTalentsCommand): Promise<Result<void>> {
    const talents: Talent[] = [];

    for (const name of command.names) {
      const result = Talent.create(name);
      if (!result.ok) return err(result.error);
      talents.push(result.value);
    }

    return this.repository.saveAll(talents);
  }
}
