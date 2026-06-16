import { SetGroupFactory } from '@codex/orm/__tests__/factories/set-group.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import type { Result } from '../../../shared/helpers/result';
import { SetRelease, type SetReleaseProps } from '../../domain/set-release';
import { SetReleasePrismaRepository } from '../set-release.prisma.repository';

const toSetRelease = (props: SetReleaseProps): SetRelease => {
  const result = SetRelease.create(props);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createSetReleasePrismaRepositoryFixture = (tx: TransactionClient) => {
  const repository = new SetReleasePrismaRepository(tx);
  let storedSets: SetRelease[] = [];
  let lastSave: Result<void> | null = null;

  return {
    async givenExistingGroups(names: string[]) {
      for (const name of names) await SetGroupFactory.create({ name });
    },
    async whenImportingSets(sets: SetReleaseProps[]) {
      lastSave = await repository.saveAll(sets.map(toSetRelease));
      expectOk(lastSave);
      await this.whenGettingSets();
    },
    async whenImportingSetsExpectingFailure(sets: SetReleaseProps[]) {
      lastSave = await repository.saveAll(sets.map(toSetRelease));
    },
    async whenGettingSets() {
      const result = await repository.findAll();
      expectOk(result);
      storedSets = result.value;
    },
    thenStoredSetNamesShouldBe(expectedNames: string[]) {
      expect(storedSets.map((set) => set.name)).toEqual(expectedNames);
    },
    thenImportShouldHaveFailed() {
      expect(lastSave?.ok).toBe(false);
    },
  };
};
