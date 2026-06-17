import type { Prisma, PrismaClient } from '@codex/orm';

import type { AppError } from './errors';
import { type Result, err } from './result';
import type { TransactionPerformer } from './transaction';

class RollbackError extends Error {
  constructor(public readonly failure: AppError) {
    super('transaction rolled back');
  }
}

export class PrismaTransactionPerformer implements TransactionPerformer<Prisma.TransactionClient> {
  constructor(private readonly prisma: PrismaClient) {}

  async perform<R>(fn: (tx: Prisma.TransactionClient) => Promise<Result<R>>): Promise<Result<R>> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const result = await fn(tx);
        if (!result.ok) throw new RollbackError(result.error);
        return result;
      });
    } catch (error) {
      if (error instanceof RollbackError) return err(error.failure);
      throw error;
    }
  }
}
