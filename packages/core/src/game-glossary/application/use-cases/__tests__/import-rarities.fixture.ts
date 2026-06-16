import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { InMemoryRarityRepository } from '../../../infrastructure/rarity.inmemory.repository';
import { ImportRaritiesUseCase } from '../import-rarities.usecase';

export const createImportRaritiesFixture = () => {
  const fixture = createFixture();
  const repository = new InMemoryRarityRepository();
  const useCase = new ImportRaritiesUseCase(repository);

  return {
    ...fixture,
    async whenImportingRarities(names: string[]) {
      const result = await useCase.execute({ names });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenRaritiesShouldBe(expectedNames: string[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenRaritiesShouldBe: expected a successful read but got an error');
      expect(result.value.map((rarity) => rarity.name)).toEqual(expectedNames);
    },
  };
};

export type ImportRaritiesFixtureT = ReturnType<typeof createImportRaritiesFixture>;
