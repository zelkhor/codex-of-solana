import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Hero, type HeroProps } from '../../domain/hero';
import { PrismaHeroRepository } from '../hero.prisma.repository';

const toHero = (props: HeroProps): Hero => {
  const result = Hero.create(props);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createPrismaHeroRepositoryFixture = (tx: TransactionClient) => {
  const repository = new PrismaHeroRepository(tx);
  let storedHeroes: Hero[] = [];

  return {
    async whenImportingHeroes(heroes: HeroProps[]) {
      const result = await repository.saveAll(heroes.map(toHero))(tx);
      expectOk(result);
      await this.whenGettingHeroes();
    },
    async whenGettingHeroes() {
      const result = await repository.findAll();
      expectOk(result);
      storedHeroes = result.value;
    },
    thenStoredHeroesShouldBe(expected: HeroProps[]) {
      expect(storedHeroes).toEqual(expected);
    },
  };
};
