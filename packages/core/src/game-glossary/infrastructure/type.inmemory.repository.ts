import { type Result, ok } from '../../shared/helpers/result';
import type { ITypeRepository } from '../application/type.repository';
import type { Type } from '../domain/type';

export class InMemoryTypeRepository implements ITypeRepository {
  private types = new Map<string, Type>();

  setTypes(types: Type[]): this {
    this.types = new Map(types.map((type) => [type.name, type]));
    return this;
  }

  async findAll(): Promise<Result<Type[]>> {
    return ok([...this.types.values()]);
  }

  async saveAll(types: Type[]): Promise<Result<void>> {
    types.forEach((type) => this.types.set(type.name, type));
    return ok(undefined);
  }
}
