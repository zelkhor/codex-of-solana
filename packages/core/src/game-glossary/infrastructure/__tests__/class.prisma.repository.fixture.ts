import { ClassFactory } from '@codex/orm/__tests__/factories/class.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Class } from '../../domain/class';
import { PrismaClassRepository } from '../class.prisma.repository';

const toClass = (name: string): Class => {
  const result = Class.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createPrismaClassRepositoryFixture = (tx: TransactionClient) => {
  const repository = new PrismaClassRepository(tx);
  let storedClasses: Class[] = [];

  return {
    async givenPreExistingClasses(names: string[]) {
      for (const name of names) await ClassFactory.create({ name });
    },
    async whenImportingClasses(names: string[]) {
      const result = await repository.saveAll(names.map(toClass));
      expectOk(result);
      await this.whenGettingClasses();
    },
    async whenGettingClasses() {
      const result = await repository.findAll();
      expectOk(result);
      storedClasses = result.value;
    },
    thenStoredClassesShouldBe(expectedNames: string[]) {
      expect(storedClasses.map((c) => c.name)).toEqual(expectedNames);
    },
  };
};
