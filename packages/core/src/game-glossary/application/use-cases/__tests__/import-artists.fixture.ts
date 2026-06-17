import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { InMemoryArtistRepository } from '../../../infrastructure/artist.inmemory.repository';
import { ImportArtistsUseCase } from '../import-artists.usecase';

export const createImportArtistsFixture = () => {
  const fixture = createFixture();
  const repository = new InMemoryArtistRepository();
  const useCase = new ImportArtistsUseCase(repository);

  return {
    ...fixture,
    async whenImportingArtists(names: string[]) {
      const result = await useCase.execute({ names });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenArtistsShouldBe(expectedNames: string[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenArtistsShouldBe: expected a successful read but got an error');
      expect(result.value.map((artist) => artist.name)).toEqual(expectedNames);
    },
  };
};

export type ImportArtistsFixtureT = ReturnType<typeof createImportArtistsFixture>;
