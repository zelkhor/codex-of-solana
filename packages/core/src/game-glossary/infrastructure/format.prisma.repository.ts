import type { Prisma } from '@codex/orm';

import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';
import type { IFormatRepository } from '../application/format.repository';
import { Format } from '../domain/format';

export class FormatRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'FORMAT_REPOSITORY_ERROR',
      cause ? `Format repository failure: ${cause}` : 'Format repository failure',
    );
  }
}

export class PrismaFormatRepository implements IFormatRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Format[]>> {
    try {
      const rows = await this.prisma.format.findMany({ orderBy: { name: 'asc' } });

      const formats: Format[] = [];

      for (const row of rows) {
        const result = Format.create(row.name);
        if (!result.ok) return err(result.error);
        formats.push(result.value);
      }

      return ok(formats);
    } catch (error) {
      return err(new FormatRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(formats: Format[]): Promise<Result<void>> {
    try {
      await this.prisma.format.createMany({
        data: formats.map((format) => ({ name: format.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new FormatRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
