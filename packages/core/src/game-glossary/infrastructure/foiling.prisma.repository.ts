import type { Prisma } from '@codex/orm';

import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';
import type { IFoilingRepository } from '../application/foiling.repository';
import { Foiling } from '../domain/foiling';

export class FoilingRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'FOILING_REPOSITORY_ERROR',
      cause ? `Foiling repository failure: ${cause}` : 'Foiling repository failure',
    );
  }
}

export class PrismaFoilingRepository implements IFoilingRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Foiling[]>> {
    try {
      const rows = await this.prisma.foiling.findMany({ orderBy: { name: 'asc' } });

      const foilings: Foiling[] = [];

      for (const row of rows) {
        const result = Foiling.create(row.name);
        if (!result.ok) return err(result.error);
        foilings.push(result.value);
      }

      return ok(foilings);
    } catch (error) {
      return err(new FoilingRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(foilings: Foiling[]): Promise<Result<void>> {
    try {
      await this.prisma.foiling.createMany({
        data: foilings.map((foiling) => ({ name: foiling.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new FoilingRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
