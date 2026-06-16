import { type Result, ok } from '../../shared/helpers/result';
import type { ISubtypeRepository } from '../application/subtype.repository';
import type { Subtype } from '../domain/subtype';

export class InMemorySubtypeRepository implements ISubtypeRepository {
  private subtypes = new Map<string, Subtype>();

  setSubtypes(subtypes: Subtype[]): this {
    this.subtypes = new Map(subtypes.map((subtype) => [subtype.name, subtype]));
    return this;
  }

  async findAll(): Promise<Result<Subtype[]>> {
    return ok([...this.subtypes.values()]);
  }

  async saveAll(subtypes: Subtype[]): Promise<Result<void>> {
    subtypes.forEach((subtype) => this.subtypes.set(subtype.name, subtype));
    return ok(undefined);
  }
}
