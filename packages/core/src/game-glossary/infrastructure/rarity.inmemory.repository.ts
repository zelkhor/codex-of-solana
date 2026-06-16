import { type Result, ok } from '../../shared/helpers/result';
import type { IRarityRepository } from '../application/rarity.repository';
import type { Rarity } from '../domain/rarity';

export class InMemoryRarityRepository implements IRarityRepository {
  private rarities = new Map<string, Rarity>();

  setRarities(rarities: Rarity[]): this {
    this.rarities = new Map(rarities.map((rarity) => [rarity.name, rarity]));
    return this;
  }

  async findAll(): Promise<Result<Rarity[]>> {
    return ok([...this.rarities.values()]);
  }

  async saveAll(rarities: Rarity[]): Promise<Result<void>> {
    rarities.forEach((rarity) => this.rarities.set(rarity.name, rarity));
    return ok(undefined);
  }
}
