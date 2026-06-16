import type { Prisma } from '@codex/orm';

import { type Result, err, ok } from '../../shared/helpers/result';
import type { ISubtypeRepository } from '../application/subtype.repository';
import { Subtype } from '../domain/subtype';
import { SubtypeRepositoryError } from './game-glossary.repository.errors';

export class SubtypePrismaRepository implements ISubtypeRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Subtype[]>> {
    try {
      const rows = await this.prisma.subtype.findMany({ orderBy: { name: 'asc' } });

      const subtypes: Subtype[] = [];

      for (const row of rows) {
        const result = Subtype.create(row.name);
        if (!result.ok) return err(result.error);
        subtypes.push(result.value);
      }

      return ok(subtypes);
    } catch (error) {
      return err(new SubtypeRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(subtypes: Subtype[]): Promise<Result<void>> {
    try {
      await this.prisma.subtype.createMany({
        data: subtypes.map((subtype) => ({ name: subtype.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new SubtypeRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
