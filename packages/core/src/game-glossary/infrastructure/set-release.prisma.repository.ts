import type { Prisma } from '@codex/orm';

import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';
import type { ISetReleaseRepository } from '../application/set-release.repository';
import { SetRelease } from '../domain/set-release';

export class SetReleaseRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'SET_RELEASE_REPOSITORY_ERROR',
      cause ? `Set release repository failure: ${cause}` : 'Set release repository failure',
    );
  }
}

export class SetReleasePrismaRepository implements ISetReleaseRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<SetRelease[]>> {
    try {
      const rows = await this.prisma.set.findMany({
        include: { group: true },
        orderBy: [{ releaseDate: 'asc' }, { releaseOrder: 'asc' }],
      });

      const sets: SetRelease[] = [];

      for (const row of rows) {
        const result = SetRelease.create({
          name: row.name,
          group: row.group.name,
          releaseDate: row.releaseDate,
          releaseOrder: row.releaseOrder,
        });
        if (!result.ok) return err(result.error);
        sets.push(result.value);
      }

      return ok(sets);
    } catch (error) {
      return err(new SetReleaseRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  async saveAll(sets: SetRelease[]): Promise<Result<void>> {
    try {
      const groups = await this.prisma.setGroup.findMany();
      const groupIdByName = new Map(groups.map((group) => [group.name, group.id]));

      const data: Prisma.SetCreateManyInput[] = [];
      for (const set of sets) {
        const groupId = groupIdByName.get(set.group);

        if (groupId === undefined)
          return err(new SetReleaseRepositoryError(`unknown group "${set.group}"`));

        data.push({
          name: set.name,
          groupId,
          releaseDate: set.releaseDate,
          releaseOrder: set.releaseOrder,
        });
      }

      await this.prisma.set.createMany({ data, skipDuplicates: true });

      return ok(undefined);
    } catch (error) {
      return err(new SetReleaseRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }
}
