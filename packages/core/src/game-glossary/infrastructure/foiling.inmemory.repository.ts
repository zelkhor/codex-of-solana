import { type Result, ok } from '../../shared/helpers/result';
import type { IFoilingRepository } from '../application/foiling.repository';
import type { Foiling } from '../domain/foiling';

export class InMemoryFoilingRepository implements IFoilingRepository {
  private foilings = new Map<string, Foiling>();

  setFoilings(foilings: Foiling[]): this {
    this.foilings = new Map(foilings.map((foiling) => [foiling.name, foiling]));
    return this;
  }

  async findAll(): Promise<Result<Foiling[]>> {
    return ok([...this.foilings.values()]);
  }

  async saveAll(foilings: Foiling[]): Promise<Result<void>> {
    foilings.forEach((foiling) => this.foilings.set(foiling.name, foiling));
    return ok(undefined);
  }
}
