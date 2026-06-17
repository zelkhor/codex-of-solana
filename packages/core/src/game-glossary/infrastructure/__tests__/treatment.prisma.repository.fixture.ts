import { TreatmentFactory } from '@codex/orm/__tests__/factories/treatment.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Treatment } from '../../domain/treatment';
import { PrismaTreatmentRepository } from '../treatment.prisma.repository';

const toTreatment = (name: string): Treatment => {
  const result = Treatment.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createPrismaTreatmentRepositoryFixture = (tx: TransactionClient) => {
  const repository = new PrismaTreatmentRepository(tx);
  let storedTreatments: Treatment[] = [];

  return {
    async givenPreExistingTreatments(names: string[]) {
      for (const name of names) await TreatmentFactory.create({ name });
    },
    async whenImportingTreatments(names: string[]) {
      const result = await repository.saveAll(names.map(toTreatment));
      expectOk(result);
      await this.whenGettingTreatments();
    },
    async whenGettingTreatments() {
      const result = await repository.findAll();
      expectOk(result);
      storedTreatments = result.value;
    },
    thenStoredTreatmentsShouldBe(expectedNames: string[]) {
      expect(storedTreatments.map((t) => t.name)).toEqual(expectedNames);
    },
  };
};
