import { type Result, err, ok } from '../../shared/helpers/result';
import type { IHeroRepository } from '../application/hero.repository';
import { Hero } from '../domain/hero';

export class InMemoryHeroRepository implements IHeroRepository<unknown> {
  private heroes = new Map<string, Hero>();

  setHeroes(heroes: Hero[]): this {
    this.heroes = new Map(heroes.map((hero) => [hero.name, hero]));
    return this;
  }

  async findAll(): Promise<Result<Hero[]>> {
    const stored = [...this.heroes.values()];
    const inverse = new Map<string, string>();
    for (const hero of stored) {
      if (hero.counterpart !== null) inverse.set(hero.counterpart, hero.name);
    }

    const heroes: Hero[] = [];
    for (const hero of stored) {
      const counterpart = hero.counterpart ?? inverse.get(hero.name) ?? null;
      const result = Hero.create({ name: hero.name, isYoung: hero.isYoung, counterpart });
      if (!result.ok) return err(result.error);
      heroes.push(result.value);
    }
    return ok(heroes);
  }

  saveAll(heroes: Hero[]): (tx?: unknown) => Promise<Result<void>> {
    return async () => {
      for (const hero of heroes) {
        if (!this.heroes.has(hero.name)) this.heroes.set(hero.name, hero);
      }
      return ok(undefined);
    };
  }
}
