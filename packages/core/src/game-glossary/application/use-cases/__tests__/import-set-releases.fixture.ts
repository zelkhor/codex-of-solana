import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import type { SetReleaseProps } from '../../../domain/set-release';
import { InMemorySetReleaseRepository } from '../../../infrastructure/set-release.inmemory.repository';
import { ImportSetReleasesUseCase, type SetReleaseInput } from '../import-set-releases.usecase';

export const createImportSetReleasesFixture = () => {
  const fixture = createFixture();
  const repository = new InMemorySetReleaseRepository();
  const useCase = new ImportSetReleasesUseCase(repository);

  return {
    ...fixture,
    async whenImportingSets(sets: SetReleaseInput[]) {
      const result = await useCase.execute({ sets });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenSetsShouldBe(expected: SetReleaseProps[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenSetsShouldBe: expected a successful read but got an error');
      expect(result.value).toEqual(expected);
    },
  };
};

export type ImportSetReleasesFixtureT = ReturnType<typeof createImportSetReleasesFixture>;
