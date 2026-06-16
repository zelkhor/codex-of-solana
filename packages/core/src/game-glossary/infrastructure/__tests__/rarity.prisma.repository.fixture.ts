import { RarityFactory } from '@codex/orm/__tests__/factories/rarity.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Rarity } from '../../domain/rarity';
import { RarityPrismaRepository } from '../rarity.prisma.repository';

const toRarity = (name: string): Rarity => {
  const result = Rarity.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createRarityPrismaRepositoryFixture = (tx: TransactionClient) => {
  const repository = new RarityPrismaRepository(tx);
  let storedRarities: Rarity[] = [];

  return {
    async givenPreExistingRarities(names: string[]) {
      for (const name of names) await RarityFactory.create({ name });
    },
    async whenImportingRarities(names: string[]) {
      const result = await repository.saveAll(names.map(toRarity));
      expectOk(result);
      await this.whenGettingRarities();
    },
    async whenGettingRarities() {
      const result = await repository.findAll();
      expectOk(result);
      storedRarities = result.value;
    },
    thenStoredRaritiesShouldBe(expectedNames: string[]) {
      expect(storedRarities.map((r) => r.name)).toEqual(expectedNames);
    },
  };
};
