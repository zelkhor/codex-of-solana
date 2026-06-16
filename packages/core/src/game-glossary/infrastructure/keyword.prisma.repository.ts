import type { Prisma } from '@codex/orm';

import { type Result, err, ok } from '../../shared/helpers/result';
import type { IKeywordRepository } from '../application/keyword.repository';
import { Keyword } from '../domain/keyword';
import { KeywordRepositoryError } from './game-glossary.repository.errors';

export class KeywordPrismaRepository implements IKeywordRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Keyword[]>> {
    try {
      const rows = await this.prisma.keyword.findMany({ orderBy: { name: 'asc' } });

      const keywords: Keyword[] = [];

      for (const row of rows) {
        const result = Keyword.create(row.name);
        if (!result.ok) return err(result.error);
        keywords.push(result.value);
      }

      return ok(keywords);
    } catch (error) {
      return err(new KeywordRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(keywords: Keyword[]): Promise<Result<void>> {
    try {
      await this.prisma.keyword.createMany({
        data: keywords.map((keyword) => ({ name: keyword.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new KeywordRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
