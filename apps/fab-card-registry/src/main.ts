import { Class } from '@flesh-and-blood/types';
import 'dotenv/config';

import { ClassPrismaRepository, ImportClassesUseCase } from '@codex/core';
import { prisma } from '@codex/orm';

const classNames = (): string[] => Object.values(Class).filter((name) => name !== Class.NotClassed);

const main = async () => {
  console.log('[fab-card-registry] sync starting…');

  const classRepository = new ClassPrismaRepository(prisma);

  try {
    const importClasses = new ImportClassesUseCase(classRepository);

    const names = classNames();
    const result = await importClasses.execute({ names });
    if (!result.ok) throw result.error;

    console.log(`[fab-card-registry] synced ${names.length} classes.`);
  } finally {
    await prisma.$disconnect();
  }
};

void main();
