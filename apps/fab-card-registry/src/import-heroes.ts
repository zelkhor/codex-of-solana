import { cards as fabCards } from '@flesh-and-blood/cards';
import { Type } from '@flesh-and-blood/types';
import prompts from 'prompts';

import type { HeroInput, IHeroRepository, ImportHeroesUseCase } from '@codex/core';
import type { Prisma } from '@codex/orm';

export type HeroImportDependencies = {
  heroRepository: IHeroRepository<Prisma.TransactionClient>;
  importHeroesUseCase: ImportHeroesUseCase<Prisma.TransactionClient>;
};

const NO_MATCH = ' no-match';

const abortOnCancel = {
  onCancel: () => {
    throw new Error('[fab-card-registry] hero import cancelled.');
  },
};

type HeroCard = { name: string; isYoung: boolean; group: string };

const heroCards = (): HeroCard[] =>
  fabCards
    .filter((card) => card.types.includes(Type.Hero) && card.hero !== undefined)
    .map((card) => ({ name: card.name, isYoung: card.young === true, group: String(card.hero) }));

export const importHeroes = async ({
  heroRepository,
  importHeroesUseCase,
}: HeroImportDependencies): Promise<void> => {
  const allHeroCards = heroCards();

  const existing = await heroRepository.findAll();
  if (!existing.ok) throw existing.error;
  const existingCounterpart = new Map(existing.value.map((hero) => [hero.name, hero.counterpart]));

  const newHeroCards = allHeroCards.filter((card) => !existingCounterpart.has(card.name));
  if (newHeroCards.length === 0) {
    console.log('[fab-card-registry] no new heroes to import.');
    return;
  }

  console.log(`[fab-card-registry] ${newHeroCards.length} new hero(es) to import.`);

  const membersByGroup = new Map<string, HeroCard[]>();
  for (const card of allHeroCards) {
    const bucket = membersByGroup.get(card.group);
    if (bucket) bucket.push(card);
    else membersByGroup.set(card.group, [card]);
  }

  const resolvedCounterpart = new Map<string, string | null>(
    newHeroCards.map((card) => [card.name, null]),
  );
  const isNew = (name: string): boolean => resolvedCounterpart.has(name);
  const isLinked = (name: string): boolean =>
    isNew(name)
      ? resolvedCounterpart.get(name) !== null
      : (existingCounterpart.get(name) ?? null) !== null;
  const link = (youngName: string, adultName: string): void => {
    if (isNew(youngName)) resolvedCounterpart.set(youngName, adultName);
    if (isNew(adultName)) resolvedCounterpart.set(adultName, youngName);
  };

  for (const group of new Set(newHeroCards.map((card) => card.group))) {
    const members = membersByGroup.get(group) ?? [];
    const youngs = members.filter((member) => member.isYoung);
    const adults = members.filter((member) => !member.isYoung);
    if (youngs.length === 0 || adults.length === 0) continue;
    if (youngs.length === 1 && adults.length === 1) {
      link(youngs[0].name, adults[0].name);
      continue;
    }

    const remainingAdults = adults.map((adult) => adult.name).filter((name) => !isLinked(name));
    for (const young of youngs.map((member) => member.name)) {
      if (isLinked(young)) continue;
      if (remainingAdults.length === 0) break;
      if (!isNew(young) && !remainingAdults.some(isNew)) continue;

      const { choice } = await prompts(
        {
          type: 'select',
          name: 'choice',
          message: `Pick the adult form of young hero "${young}"`,
          choices: [
            ...remainingAdults.map((name) => ({ title: name, value: name })),
            { title: '— no match —', value: NO_MATCH },
          ],
        },
        abortOnCancel,
      );
      if (choice === NO_MATCH) continue;

      link(young, choice as string);
      const index = remainingAdults.indexOf(choice as string);
      if (index >= 0) remainingAdults.splice(index, 1);
      console.log(`  ✓ ${young} ↔ ${choice}`);
    }
  }

  const inputs: HeroInput[] = newHeroCards.map((card) => ({
    name: card.name,
    isYoung: card.isYoung,
    counterpart: resolvedCounterpart.get(card.name) ?? null,
  }));

  const imported = await importHeroesUseCase.execute({ heroes: inputs });
  if (!imported.ok) throw imported.error;

  console.log(`[fab-card-registry] synced ${inputs.length} heroes.`);
};
