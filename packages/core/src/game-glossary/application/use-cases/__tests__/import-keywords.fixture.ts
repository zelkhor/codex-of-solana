import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { InMemoryKeywordRepository } from '../../../infrastructure/keyword.inmemory.repository';
import { ImportKeywordsUseCase } from '../import-keywords.usecase';

export const createImportKeywordsFixture = () => {
  const fixture = createFixture();
  const repository = new InMemoryKeywordRepository();
  const useCase = new ImportKeywordsUseCase(repository);

  return {
    ...fixture,
    async whenImportingKeywords(names: string[]) {
      const result = await useCase.execute({ names });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenKeywordsShouldBe(expectedNames: string[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenKeywordsShouldBe: expected a successful read but got an error');
      expect(result.value.map((keyword) => keyword.name)).toEqual(expectedNames);
    },
  };
};

export type ImportKeywordsFixtureT = ReturnType<typeof createImportKeywordsFixture>;
