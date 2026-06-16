import type { Prisma } from '@codex/orm';

import { type Result, err, ok } from '../../shared/helpers/result';
import type { ITypeRepository } from '../application/type.repository';
import { Type } from '../domain/type';
import { CardTypeRepositoryError } from './game-glossary.repository.errors';

export class TypePrismaRepository implements ITypeRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Type[]>> {
    try {
      const rows = await this.prisma.cardType.findMany({ orderBy: { name: 'asc' } });

      const cardTypes: Type[] = [];

      for (const row of rows) {
        const result = Type.create(row.name);
        if (!result.ok) return err(result.error);
        cardTypes.push(result.value);
      }

      return ok(cardTypes);
    } catch (error) {
      return err(new CardTypeRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(cardTypes: Type[]): Promise<Result<void>> {
    try {
      await this.prisma.cardType.createMany({
        data: cardTypes.map((cardType) => ({ name: cardType.name })),
        skipDuplicates: true,
      });

      return ok(undefined);
    } catch (error) {
      return err(new CardTypeRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
