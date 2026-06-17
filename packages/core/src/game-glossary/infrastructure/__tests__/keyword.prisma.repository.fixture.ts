import { KeywordFactory } from '@codex/orm/__tests__/factories/keyword.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Keyword } from '../../domain/keyword';
import { PrismaKeywordRepository } from '../keyword.prisma.repository';

const toKeyword = (name: string): Keyword => {
  const result = Keyword.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createPrismaKeywordRepositoryFixture = (tx: TransactionClient) => {
  const repository = new PrismaKeywordRepository(tx);
  let storedKeywords: Keyword[] = [];

  return {
    async givenPreExistingKeywords(names: string[]) {
      for (const name of names) await KeywordFactory.create({ name });
    },
    async whenImportingKeywords(names: string[]) {
      const result = await repository.saveAll(names.map(toKeyword));
      expectOk(result);
      await this.whenGettingKeywords();
    },
    async whenGettingKeywords() {
      const result = await repository.findAll();
      expectOk(result);
      storedKeywords = result.value;
    },
    thenStoredKeywordsShouldBe(expectedNames: string[]) {
      expect(storedKeywords.map((k) => k.name)).toEqual(expectedNames);
    },
  };
};
