import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { InMemoryTreatmentRepository } from '../../../infrastructure/treatment.inmemory.repository';
import { ImportTreatmentsUseCase } from '../import-treatments.usecase';

export const createImportTreatmentsFixture = () => {
  const fixture = createFixture();
  const repository = new InMemoryTreatmentRepository();
  const useCase = new ImportTreatmentsUseCase(repository);

  return {
    ...fixture,
    async whenImportingTreatments(names: string[]) {
      const result = await useCase.execute({ names });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenTreatmentsShouldBe(expectedNames: string[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenTreatmentsShouldBe: expected a successful read but got an error');
      expect(result.value.map((treatment) => treatment.name)).toEqual(expectedNames);
    },
  };
};

export type ImportTreatmentsFixtureT = ReturnType<typeof createImportTreatmentsFixture>;
