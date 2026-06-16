import type { Prisma } from '@codex/orm';

import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';
import type { ITreatmentRepository } from '../application/treatment.repository';
import { Treatment } from '../domain/treatment';

export class TreatmentRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'TREATMENT_REPOSITORY_ERROR',
      cause ? `Treatment repository failure: ${cause}` : 'Treatment repository failure',
    );
  }
}

export class TreatmentPrismaRepository implements ITreatmentRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Treatment[]>> {
    try {
      const rows = await this.prisma.treatment.findMany({ orderBy: { name: 'asc' } });

      const treatments: Treatment[] = [];

      for (const row of rows) {
        const result = Treatment.create(row.name);
        if (!result.ok) return err(result.error);
        treatments.push(result.value);
      }

      return ok(treatments);
    } catch (error) {
      return err(new TreatmentRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(treatments: Treatment[]): Promise<Result<void>> {
    try {
      await this.prisma.treatment.createMany({
        data: treatments.map((treatment) => ({ name: treatment.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new TreatmentRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
