import type { Prisma } from '@codex/orm';

import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';
import type { IRarityRepository } from '../application/rarity.repository';
import { Rarity } from '../domain/rarity';

export class RarityRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'RARITY_REPOSITORY_ERROR',
      cause ? `Rarity repository failure: ${cause}` : 'Rarity repository failure',
    );
  }
}

export class PrismaRarityRepository implements IRarityRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Rarity[]>> {
    try {
      const rows = await this.prisma.rarity.findMany({ orderBy: { name: 'asc' } });

      const rarities: Rarity[] = [];

      for (const row of rows) {
        const result = Rarity.create(row.name);
        if (!result.ok) return err(result.error);
        rarities.push(result.value);
      }

      return ok(rarities);
    } catch (error) {
      return err(new RarityRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(rarities: Rarity[]): Promise<Result<void>> {
    try {
      await this.prisma.rarity.createMany({
        data: rarities.map((rarity) => ({ name: rarity.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new RarityRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
