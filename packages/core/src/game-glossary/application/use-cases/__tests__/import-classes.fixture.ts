import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { InMemoryClassRepository } from '../../../infrastructure/class.inmemory.repository';
import { ImportClassesUseCase } from '../import-classes.usecase';

export const createImportClassesFixture = () => {
  const fixture = createFixture();
  const repository = new InMemoryClassRepository();
  const useCase = new ImportClassesUseCase(repository);

  return {
    ...fixture,
    async whenImportingClasses(names: string[]) {
      const result = await useCase.execute({ names });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenClassesShouldBe(expectedNames: string[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenClassesShouldBe: expected a successful read but got an error');
      expect(result.value.map((aClass) => aClass.name)).toEqual(expectedNames);
    },
  };
};

export type ImportClassesFixtureT = ReturnType<typeof createImportClassesFixture>;
