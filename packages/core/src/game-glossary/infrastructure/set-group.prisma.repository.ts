import type { Prisma } from '@codex/orm';

import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';
import type { ISetGroupRepository } from '../application/set-group.repository';
import { SetGroup } from '../domain/set-group';

export class SetGroupRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'SET_GROUP_REPOSITORY_ERROR',
      cause ? `Set group repository failure: ${cause}` : 'Set group repository failure',
    );
  }
}

export class SetGroupPrismaRepository implements ISetGroupRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<SetGroup[]>> {
    try {
      const rows = await this.prisma.setGroup.findMany({ orderBy: { name: 'asc' } });

      const groups: SetGroup[] = [];

      for (const row of rows) {
        const result = SetGroup.create(row.name);
        if (!result.ok) return err(result.error);
        groups.push(result.value);
      }

      return ok(groups);
    } catch (error) {
      return err(new SetGroupRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async save(group: SetGroup): Promise<Result<void>> {
    try {
      await this.prisma.setGroup.create({ data: { name: group.name } });

      return ok(undefined);
    } catch (error) {
      return err(new SetGroupRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
