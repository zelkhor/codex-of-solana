import { type Result, ok } from '../../shared/helpers/result';
import type { IKeywordRepository } from '../application/keyword.repository';
import type { Keyword } from '../domain/keyword';

export class InMemoryKeywordRepository implements IKeywordRepository {
  private keywords = new Map<string, Keyword>();

  setKeywords(keywords: Keyword[]): this {
    this.keywords = new Map(keywords.map((keyword) => [keyword.name, keyword]));
    return this;
  }

  async findAll(): Promise<Result<Keyword[]>> {
    return ok([...this.keywords.values()]);
  }

  async saveAll(keywords: Keyword[]): Promise<Result<void>> {
    keywords.forEach((keyword) => this.keywords.set(keyword.name, keyword));
    return ok(undefined);
  }
}
