import { EditionFactory } from '@codex/orm/__tests__/factories/edition.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Edition } from '../../domain/edition';
import { PrismaEditionRepository } from '../edition.prisma.repository';

const toEdition = (name: string): Edition => {
  const result = Edition.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createPrismaEditionRepositoryFixture = (tx: TransactionClient) => {
  const repository = new PrismaEditionRepository(tx);
  let storedEditions: Edition[] = [];

  return {
    async givenPreExistingEditions(names: string[]) {
      for (const name of names) await EditionFactory.create({ name });
    },
    async whenImportingEditions(names: string[]) {
      const result = await repository.saveAll(names.map(toEdition));
      expectOk(result);
      await this.whenGettingEditions();
    },
    async whenGettingEditions() {
      const result = await repository.findAll();
      expectOk(result);
      storedEditions = result.value;
    },
    thenStoredEditionsShouldBe(expectedNames: string[]) {
      expect(storedEditions.map((e) => e.name)).toEqual(expectedNames);
    },
  };
};
