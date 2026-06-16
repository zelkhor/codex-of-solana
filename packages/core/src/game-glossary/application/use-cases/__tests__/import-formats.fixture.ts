import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { InMemoryFormatRepository } from '../../../infrastructure/format.inmemory.repository';
import { ImportFormatsUseCase } from '../import-formats.usecase';

export const createImportFormatsFixture = () => {
  const fixture = createFixture();
  const repository = new InMemoryFormatRepository();
  const useCase = new ImportFormatsUseCase(repository);

  return {
    ...fixture,
    async whenImportingFormats(names: string[]) {
      const result = await useCase.execute({ names });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenFormatsShouldBe(expectedNames: string[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenFormatsShouldBe: expected a successful read but got an error');
      expect(result.value.map((format) => format.name)).toEqual(expectedNames);
    },
  };
};

export type ImportFormatsFixtureT = ReturnType<typeof createImportFormatsFixture>;
