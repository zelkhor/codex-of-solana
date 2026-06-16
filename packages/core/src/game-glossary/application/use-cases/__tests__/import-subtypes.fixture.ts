import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { InMemorySubtypeRepository } from '../../../infrastructure/subtype.inmemory.repository';
import { ImportSubtypesUseCase } from '../import-subtypes.usecase';

export const createImportSubtypesFixture = () => {
  const fixture = createFixture();
  const repository = new InMemorySubtypeRepository();
  const useCase = new ImportSubtypesUseCase(repository);

  return {
    ...fixture,
    async whenImportingSubtypes(names: string[]) {
      const result = await useCase.execute({ names });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenSubtypesShouldBe(expectedNames: string[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenSubtypesShouldBe: expected a successful read but got an error');
      expect(result.value.map((subtype) => subtype.name)).toEqual(expectedNames);
    },
  };
};

export type ImportSubtypesFixtureT = ReturnType<typeof createImportSubtypesFixture>;
