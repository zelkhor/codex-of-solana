import { type Result, err } from '../../../shared/helpers/result';
import { SetRelease } from '../../domain/set-release';
import type { ISetReleaseRepository } from '../set-release.repository';

export type SetReleaseInput = {
  name: string;
  group: string;
  releaseDate: Date;
  releaseOrder: number;
};

export type ImportSetReleasesCommand = {
  sets: SetReleaseInput[];
};

export class ImportSetReleasesUseCase {
  constructor(private readonly repository: ISetReleaseRepository) {}

  async execute(command: ImportSetReleasesCommand): Promise<Result<void>> {
    const sets: SetRelease[] = [];

    for (const input of command.sets) {
      const result = SetRelease.create(input);
      if (!result.ok) return err(result.error);
      sets.push(result.value);
    }

    return this.repository.saveAll(sets);
  }
}
