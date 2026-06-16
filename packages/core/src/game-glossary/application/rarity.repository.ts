import type { Result } from '../../shared/helpers/result';
import type { Rarity } from '../domain/rarity';

export interface IRarityRepository {
  findAll(): Promise<Result<Rarity[]>>;
  saveAll(rarities: Rarity[]): Promise<Result<void>>;
}
