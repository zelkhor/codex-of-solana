import { createFixture } from '../../../__tests__/helpers/create-fixture';
import { InMemoryTalentRepository } from '../../infrastructure/talent.inmemory.repository';
import { ImportTalentsUseCase } from '../import-talents.usecase';

export const createImportTalentsFixture = () => {
  const fixture = createFixture();
  const repository = new InMemoryTalentRepository();
  const useCase = new ImportTalentsUseCase(repository);

  return {
    ...fixture,
    async whenImportingTalents(names: string[]) {
      const result = await useCase.execute({ names });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenTalentsShouldBe(expectedNames: string[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenTalentsShouldBe: expected a successful read but got an error');
      expect(result.value.map((talent) => talent.name)).toEqual(expectedNames);
    },
  };
};

export type ImportTalentsFixtureT = ReturnType<typeof createImportTalentsFixture>;
