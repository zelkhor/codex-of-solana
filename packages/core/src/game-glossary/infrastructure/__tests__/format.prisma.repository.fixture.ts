import { FormatFactory } from '@codex/orm/__tests__/factories/format.factory';
import type { TransactionClient } from '@codex/orm/__tests__/test-database';

import { expectOk } from '../../../__tests__/helpers/result.helpers';
import { Format } from '../../domain/format';
import { PrismaFormatRepository } from '../format.prisma.repository';

const toFormat = (name: string): Format => {
  const result = Format.create(name);
  if (!result.ok) throw result.error;
  return result.value;
};

export const createPrismaFormatRepositoryFixture = (tx: TransactionClient) => {
  const repository = new PrismaFormatRepository(tx);
  let storedFormats: Format[] = [];

  return {
    async givenPreExistingFormats(names: string[]) {
      for (const name of names) await FormatFactory.create({ name });
    },
    async whenImportingFormats(names: string[]) {
      const result = await repository.saveAll(names.map(toFormat));
      expectOk(result);
      await this.whenGettingFormats();
    },
    async whenGettingFormats() {
      const result = await repository.findAll();
      expectOk(result);
      storedFormats = result.value;
    },
    thenStoredFormatsShouldBe(expectedNames: string[]) {
      expect(storedFormats.map((f) => f.name)).toEqual(expectedNames);
    },
  };
};
