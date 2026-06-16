import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { InMemoryEditionRepository } from '../../../infrastructure/edition.inmemory.repository';
import { ImportEditionsUseCase } from '../import-editions.usecase';

export const createImportEditionsFixture = () => {
  const fixture = createFixture();
  const repository = new InMemoryEditionRepository();
  const useCase = new ImportEditionsUseCase(repository);

  return {
    ...fixture,
    async whenImportingEditions(names: string[]) {
      const result = await useCase.execute({ names });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenEditionsShouldBe(expectedNames: string[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenEditionsShouldBe: expected a successful read but got an error');
      expect(result.value.map((edition) => edition.name)).toEqual(expectedNames);
    },
  };
};

export type ImportEditionsFixtureT = ReturnType<typeof createImportEditionsFixture>;
