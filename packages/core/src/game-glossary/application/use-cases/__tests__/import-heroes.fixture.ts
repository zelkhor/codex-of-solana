import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { NullTransactionPerformer } from '../../../../shared/helpers/transaction';
import { Hero, type HeroProps } from '../../../domain/hero';
import { InMemoryHeroRepository } from '../../../infrastructure/hero.inmemory.repository';
import { ImportHeroesUseCase } from '../import-heroes.usecase';

const toHero = (props: HeroProps): Hero => {
  const result = Hero.create(props);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createImportHeroesFixture = () => {
  const fixture = createFixture();
  const repository = new InMemoryHeroRepository();
  const useCase = new ImportHeroesUseCase(repository, new NullTransactionPerformer());

  return {
    ...fixture,
    givenExistingHeroes(heroes: HeroProps[]) {
      repository.setHeroes(heroes.map(toHero));
    },
    async whenImportingHeroes(heroes: HeroProps[]) {
      const result = await useCase.execute({ heroes });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenHeroesShouldBe(expected: HeroProps[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenHeroesShouldBe: expected a successful read but got an error');
      expect(result.value).toEqual(expected);
    },
    async thenCounterpartOfShouldBe(name: string, counterpart: string | null) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenCounterpartOfShouldBe: expected a successful read but got an error');
      const hero = result.value.find((candidate) => candidate.name === name);
      expect(hero?.counterpart).toBe(counterpart);
    },
  };
};

export type ImportHeroesFixtureT = ReturnType<typeof createImportHeroesFixture>;
