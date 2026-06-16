import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { InMemoryFoilingRepository } from '../../../infrastructure/foiling.inmemory.repository';
import { ImportFoilingsUseCase } from '../import-foilings.usecase';

export const createImportFoilingsFixture = () => {
  const fixture = createFixture();
  const repository = new InMemoryFoilingRepository();
  const useCase = new ImportFoilingsUseCase(repository);

  return {
    ...fixture,
    async whenImportingFoilings(names: string[]) {
      const result = await useCase.execute({ names });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenFoilingsShouldBe(expected: { name: string; order: number }[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenFoilingsShouldBe: expected a successful read but got an error');
      expect(result.value.map((foiling) => ({ name: foiling.name, order: foiling.order }))).toEqual(
        expected,
      );
    },
  };
};

export type ImportFoilingsFixtureT = ReturnType<typeof createImportFoilingsFixture>;
