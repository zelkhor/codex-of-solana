import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { InMemoryTypeRepository } from '../../../infrastructure/type.inmemory.repository';
import { ImportTypesUsecase } from '../import-types.usecase';

export const createImportCardTypesFixture = () => {
  const fixture = createFixture();
  const repository = new InMemoryTypeRepository();
  const useCase = new ImportTypesUsecase(repository);

  return {
    ...fixture,
    async whenImportingCardTypes(names: string[]) {
      const result = await useCase.execute({ names });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenCardTypesShouldBe(expectedNames: string[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenCardTypesShouldBe: expected a successful read but got an error');
      expect(result.value.map((cardType) => cardType.name)).toEqual(expectedNames);
    },
  };
};

export type ImportCardTypesFixtureT = ReturnType<typeof createImportCardTypesFixture>;
