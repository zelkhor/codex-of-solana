import { type Result, err } from '../../../shared/helpers/result';
import { Treatment } from '../../domain/treatment';
import type { ITreatmentRepository } from '../treatment.repository';

export type ImportTreatmentsCommand = {
  names: string[];
};

export class ImportTreatmentsUseCase {
  constructor(private readonly repository: ITreatmentRepository) {}

  async execute(command: ImportTreatmentsCommand): Promise<Result<void>> {
    const treatments: Treatment[] = [];

    for (const name of command.names) {
      const result = Treatment.create(name);
      if (!result.ok) return err(result.error);
      treatments.push(result.value);
    }

    return this.repository.saveAll(treatments);
  }
}
