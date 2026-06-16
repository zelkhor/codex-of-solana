import { type Result, err } from '../../../shared/helpers/result';
import { Format } from '../../domain/format';
import type { IFormatRepository } from '../format.repository';

export type ImportFormatsCommand = {
  names: string[];
};

export class ImportFormatsUseCase {
  constructor(private readonly repository: IFormatRepository) {}

  async execute(command: ImportFormatsCommand): Promise<Result<void>> {
    const formats: Format[] = [];

    for (const name of command.names) {
      const result = Format.create(name);
      if (!result.ok) return err(result.error);
      formats.push(result.value);
    }

    return this.repository.saveAll(formats);
  }
}
