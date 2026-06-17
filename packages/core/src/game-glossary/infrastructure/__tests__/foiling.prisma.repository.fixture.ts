import { FoilingFactory } from '@codex/orm/__tests__/factories/foiling.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Foiling } from '../../domain/foiling';
import { PrismaFoilingRepository } from '../foiling.prisma.repository';

const toFoiling = (name: string): Foiling => {
  const result = Foiling.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createPrismaFoilingRepositoryFixture = (tx: TransactionClient) => {
  const repository = new PrismaFoilingRepository(tx);
  let storedFoilings: Foiling[] = [];

  return {
    async givenPreExistingFoilings(names: string[]) {
      for (const name of names) await FoilingFactory.create({ name });
    },
    async whenImportingFoilings(names: string[]) {
      const result = await repository.saveAll(names.map(toFoiling));
      expectOk(result);
      await this.whenGettingFoilings();
    },
    async whenGettingFoilings() {
      const result = await repository.findAll();
      expectOk(result);
      storedFoilings = result.value;
    },
    thenStoredFoilingsShouldBe(expectedNames: string[]) {
      expect(storedFoilings.map((f) => f.name)).toEqual(expectedNames);
    },
  };
};
