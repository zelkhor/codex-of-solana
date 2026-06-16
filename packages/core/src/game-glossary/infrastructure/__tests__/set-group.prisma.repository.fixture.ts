import { SetGroupFactory } from '@codex/orm/__tests__/factories/set-group.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { SetGroup } from '../../domain/set-group';
import { SetGroupPrismaRepository } from '../set-group.prisma.repository';

const toSetGroup = (name: string): SetGroup => {
  const result = SetGroup.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createSetGroupPrismaRepositoryFixture = (tx: TransactionClient) => {
  const repository = new SetGroupPrismaRepository(tx);
  let storedGroups: SetGroup[] = [];

  return {
    async givenPreExistingGroups(names: string[]) {
      for (const name of names) await SetGroupFactory.create({ name });
    },
    async whenCreatingGroup(name: string) {
      const result = await repository.save(toSetGroup(name));
      expectOk(result);
      await this.whenGettingGroups();
    },
    async whenGettingGroups() {
      const result = await repository.findAll();
      expectOk(result);
      storedGroups = result.value;
    },
    thenStoredGroupsShouldBe(expectedNames: string[]) {
      expect(storedGroups.map((g) => g.name)).toEqual(expectedNames);
    },
  };
};
