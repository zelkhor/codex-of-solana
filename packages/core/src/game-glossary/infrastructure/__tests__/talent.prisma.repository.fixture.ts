import { TalentFactory } from '@codex/orm/__tests__/factories/talent.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Talent } from '../../domain/talent';
import { PrismaTalentRepository } from '../talent.prisma.repository';

const toTalent = (name: string): Talent => {
  const result = Talent.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createPrismaTalentRepositoryFixture = (tx: TransactionClient) => {
  const repository = new PrismaTalentRepository(tx);
  let storedTalents: Talent[] = [];

  return {
    async givenPreExistingTalents(names: string[]) {
      for (const name of names) await TalentFactory.create({ name });
    },
    async whenImportingTalents(names: string[]) {
      const result = await repository.saveAll(names.map(toTalent));
      expectOk(result);
      await this.whenGettingTalents();
    },
    async whenGettingTalents() {
      const result = await repository.findAll();
      expectOk(result);
      storedTalents = result.value;
    },
    thenStoredTalentsShouldBe(expectedNames: string[]) {
      expect(storedTalents.map((t) => t.name)).toEqual(expectedNames);
    },
  };
};
