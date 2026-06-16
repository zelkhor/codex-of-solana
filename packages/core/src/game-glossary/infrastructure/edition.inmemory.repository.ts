import { type Result, ok } from '../../shared/helpers/result';
import type { IEditionRepository } from '../application/edition.repository';
import type { Edition } from '../domain/edition';

export class InMemoryEditionRepository implements IEditionRepository {
  private editions = new Map<string, Edition>();

  setEditions(editions: Edition[]): this {
    this.editions = new Map(editions.map((edition) => [edition.name, edition]));
    return this;
  }

  async findAll(): Promise<Result<Edition[]>> {
    return ok([...this.editions.values()]);
  }

  async saveAll(editions: Edition[]): Promise<Result<void>> {
    editions.forEach((edition) => this.editions.set(edition.name, edition));
    return ok(undefined);
  }
}
