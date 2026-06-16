import { SubtypeFactory } from '@codex/orm/__tests__/factories/subtype.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Subtype } from '../../domain/subtype';
import { SubtypePrismaRepository } from '../subtype.prisma.repository';

const toSubtype = (name: string): Subtype => {
  const result = Subtype.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createSubtypePrismaRepositoryFixture = (tx: TransactionClient) => {
  const repository = new SubtypePrismaRepository(tx);
  let storedSubtypes: Subtype[] = [];

  return {
    async givenPreExistingSubtypes(names: string[]) {
      for (const name of names) await SubtypeFactory.create({ name });
    },
    async whenImportingSubtypes(names: string[]) {
      const result = await repository.saveAll(names.map(toSubtype));
      expectOk(result);
      await this.whenGettingSubtypes();
    },
    async whenGettingSubtypes() {
      const result = await repository.findAll();
      expectOk(result);
      storedSubtypes = result.value;
    },
    thenStoredSubtypesShouldBe(expectedNames: string[]) {
      expect(storedSubtypes.map((t) => t.name)).toEqual(expectedNames);
    },
  };
};
