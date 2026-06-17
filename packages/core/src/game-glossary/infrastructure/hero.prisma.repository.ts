import type { Prisma } from '@codex/orm';

import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';
import type { IHeroRepository } from '../application/hero.repository';
import { Hero } from '../domain/hero';

export class HeroRepositoryError extends AppError {
  constructor(cause?: string) {
    super(
      'HERO_REPOSITORY_ERROR',
      cause ? `Hero repository failure: ${cause}` : 'Hero repository failure',
    );
  }
}

export class PrismaHeroRepository implements IHeroRepository<Prisma.TransactionClient> {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findAll(): Promise<Result<Hero[]>> {
    try {
      const rows = await this.prisma.hero.findMany({
        include: { adultForm: true, youngForm: true },
        orderBy: { name: 'asc' },
      });

      const heroes: Hero[] = [];

      for (const row of rows) {
        const counterpart = row.isYoung
          ? (row.adultForm?.name ?? null)
          : (row.youngForm?.name ?? null);
        const result = Hero.create({ name: row.name, isYoung: row.isYoung, counterpart });
        if (!result.ok) return err(result.error);
        heroes.push(result.value);
      }

      return ok(heroes);
    } catch (error) {
      return err(new HeroRepositoryError(error instanceof Error ? error.message : undefined));
    }
  }

  saveAll(heroes: Hero[]): (tx?: Prisma.TransactionClient) => Promise<Result<void>> {
    return async (tx: Prisma.TransactionClient = this.prisma) => {
      try {
        await tx.hero.createMany({
          data: heroes.map((hero) => ({ name: hero.name, isYoung: hero.isYoung })),
          skipDuplicates: true,
        });

        for (const hero of heroes) {
          if (hero.counterpart === null) continue;
          const youngName = hero.isYoung ? hero.name : hero.counterpart;
          const adultName = hero.isYoung ? hero.counterpart : hero.name;
          await tx.hero.update({
            where: { name: youngName },
            data: { adultForm: { connect: { name: adultName } } },
          });
        }

        return ok(undefined);
      } catch (error) {
        return err(new HeroRepositoryError(error instanceof Error ? error.message : undefined));
      }
    };
  }
}
