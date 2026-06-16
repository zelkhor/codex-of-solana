import type { Prisma } from '@codex/orm';

import { type Result, err, ok } from '../../shared/helpers/result';
import type { ITypeRepository } from '../application/type.repository';
import { Type } from '../domain/type';
import { TypeRepositoryError } from './game-glossary.repository.errors';

export class TypePrismaRepository implements ITypeRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Type[]>> {
    try {
      const rows = await this.prisma.type.findMany({ orderBy: { name: 'asc' } });

      const types: Type[] = [];

      for (const row of rows) {
        const result = Type.create(row.name);
        if (!result.ok) return err(result.error);
        types.push(result.value);
      }

      return ok(types);
    } catch (error) {
      return err(new TypeRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(types: Type[]): Promise<Result<void>> {
    try {
      await this.prisma.type.createMany({
        data: types.map((type) => ({ name: type.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new TypeRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
