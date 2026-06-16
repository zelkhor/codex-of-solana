import { type Result, err } from '../../../shared/helpers/result';
import { Keyword } from '../../domain/keyword';
import type { IKeywordRepository } from '../keyword.repository';

export type ImportKeywordsCommand = {
  names: string[];
};

export class ImportKeywordsUseCase {
  constructor(private readonly repository: IKeywordRepository) {}

  async execute(command: ImportKeywordsCommand): Promise<Result<void>> {
    const keywords: Keyword[] = [];

    for (const name of command.names) {
      const result = Keyword.create(name);
      if (!result.ok) return err(result.error);
      keywords.push(result.value);
    }

    return this.repository.saveAll(keywords);
  }
}
