import type { Prisma } from '@codex/orm';

import { type Result, err, ok } from '../../shared/helpers/result';
import type { ITalentRepository } from '../application/talent.repository';
import { Talent } from '../domain/talent';
import { TalentRepositoryError } from './game-glossary.repository.errors';

export class TalentPrismaRepository implements ITalentRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Talent[]>> {
    try {
      const rows = await this.prisma.talent.findMany({ orderBy: { name: 'asc' } });

      const talents: Talent[] = [];

      for (const row of rows) {
        const result = Talent.create(row.name);
        if (!result.ok) return err(result.error);
        talents.push(result.value);
      }

      return ok(talents);
    } catch (error) {
      return err(new TalentRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(talents: Talent[]): Promise<Result<void>> {
    try {
      await this.prisma.talent.createMany({
        data: talents.map((talent) => ({ name: talent.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new TalentRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
