import { TypeFactory } from '@codex/orm/__tests__/factories/type.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Type } from '../../domain/type';
import { PrismaTypeRepository } from '../type.prisma.repository';

const toType = (name: string): Type => {
  const result = Type.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createPrismaTypeRepositoryFixture = (tx: TransactionClient) => {
  const repository = new PrismaTypeRepository(tx);
  let storedTypes: Type[] = [];

  return {
    async givenPreExistingTypes(names: string[]) {
      for (const name of names) await TypeFactory.create({ name });
    },
    async whenImportingTypes(names: string[]) {
      const result = await repository.saveAll(names.map(toType));
      expectOk(result);
      await this.whenGettingTypes();
    },
    async whenGettingTypes() {
      const result = await repository.findAll();
      expectOk(result);
      storedTypes = result.value;
    },
    thenStoredTypesShouldBe(expectedNames: string[]) {
      expect(storedTypes.map((t) => t.name)).toEqual(expectedNames);
    },
  };
};
