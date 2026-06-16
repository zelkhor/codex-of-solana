import { Class, Talent } from '@flesh-and-blood/types';
import 'dotenv/config';

import {
  ClassPrismaRepository,
  ImportClassesUseCase,
  ImportTalentsUseCase,
  TalentPrismaRepository,
} from '@codex/core';
import { prisma } from '@codex/orm';

const classNames = (): string[] => Object.values(Class).filter((name) => name !== Class.NotClassed);

const talentNames = (): string[] => Object.values(Talent);

const main = async () => {
  console.log('[fab-card-registry] sync starting…');

  const classRepository = new ClassPrismaRepository(prisma);
  const talentRepository = new TalentPrismaRepository(prisma);

  try {
    const importClasses = new ImportClassesUseCase(classRepository);

    const names = classNames();
    const result = await importClasses.execute({ names });
    if (!result.ok) throw result.error;

    console.log(`[fab-card-registry] synced ${names.length} classes.`);

    const importTalents = new ImportTalentsUseCase(talentRepository);

    const talents = talentNames();
    const talentsResult = await importTalents.execute({ names: talents });
    if (!talentsResult.ok) throw talentsResult.error;

    console.log(`[fab-card-registry] synced ${talents.length} talents.`);
  } finally {
    await prisma.$disconnect();
  }
};

void main();
