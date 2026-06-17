import type { Result } from '../../shared/helpers/result';
import type { Hero } from '../domain/hero';

export interface IHeroRepository<Client> {
  findAll(): Promise<Result<Hero[]>>;
  saveAll(heroes: Hero[]): (tx?: Client) => Promise<Result<void>>;
}
