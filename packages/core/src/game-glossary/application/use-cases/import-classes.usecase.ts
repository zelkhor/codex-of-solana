import { type Result, err } from '../../../shared/helpers/result';
import { Class } from '../../domain/class';
import type { IClassRepository } from '../class.repository';

export type ImportClassesCommand = {
  names: string[];
};

export class ImportClassesUseCase {
  constructor(private readonly repository: IClassRepository) {}

  async execute(command: ImportClassesCommand): Promise<Result<void>> {
    const classes: Class[] = [];

    for (const name of command.names) {
      const result = Class.create(name);
      if (!result.ok) return err(result.error);
      classes.push(result.value);
    }

    return this.repository.saveAll(classes);
  }
}
