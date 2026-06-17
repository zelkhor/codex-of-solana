import type { Prisma } from '@codex/orm';

import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';
import type { IEditionRepository } from '../application/edition.repository';
import { Edition } from '../domain/edition';

export class EditionRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'EDITION_REPOSITORY_ERROR',
      cause ? `Edition repository failure: ${cause}` : 'Edition repository failure',
    );
  }
}

export class PrismaEditionRepository implements IEditionRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Edition[]>> {
    try {
      const rows = await this.prisma.edition.findMany({ orderBy: { name: 'asc' } });

      const editions: Edition[] = [];

      for (const row of rows) {
        const result = Edition.create(row.name);
        if (!result.ok) return err(result.error);
        editions.push(result.value);
      }

      return ok(editions);
    } catch (error) {
      return err(new EditionRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(editions: Edition[]): Promise<Result<void>> {
    try {
      await this.prisma.edition.createMany({
        data: editions.map((edition) => ({ name: edition.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new EditionRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
