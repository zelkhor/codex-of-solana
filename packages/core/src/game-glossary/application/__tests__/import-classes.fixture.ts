import { createFixture } from '../../../__tests__/helpers/create-fixture';
import { InMemoryClassRepository } from '../../infrastructure/class.inmemory.repository';
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
  };
};
