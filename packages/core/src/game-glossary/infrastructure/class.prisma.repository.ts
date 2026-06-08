import type { Prisma } from '@codex/orm';

import { type Result, err, ok } from '../../shared/helpers/result';
import type { IClassRepository } from '../application/class.repository';
import { Class } from '../domain/class';
import { ClassRepositoryError } from './game-glossary.repository.errors';

export class ClassPrismaRepository implements IClassRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Class[]>> {
    try {
      const rows = await this.prisma.class.findMany({ orderBy: { name: 'asc' } });

      const classes: Class[] = [];

      for (const row of rows) {
        const result = Class.create(row.name);
        if (!result.ok) return err(result.error);
        classes.push(result.value);
      }

      return ok(classes);
    } catch (error) {
      return err(new ClassRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(classes: Class[]): Promise<Result<void>> {
    try {
      await this.prisma.class.createMany({
        data: classes.map((aClass) => ({ name: aClass.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new ClassRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
