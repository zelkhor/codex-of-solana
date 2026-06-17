import { Release } from '@flesh-and-blood/types';
import prompts from 'prompts';

import type {
  CreateSetGroupUseCase,
  ISetGroupRepository,
  ISetReleaseRepository,
  ImportSetReleasesUseCase,
  SetRelease,
  SetReleaseInput,
} from '@codex/core';

export type SetReleaseImportDependencies = {
  setGroupRepository: ISetGroupRepository;
  setReleaseRepository: ISetReleaseRepository;
  createSetGroup: CreateSetGroupUseCase;
  importSetReleasesUseCase: ImportSetReleasesUseCase;
};

// Sentinel value for the "create a new group" choice (won't collide with a real group name).
const CREATE_NEW_GROUP = 'create-new-group';

const abortOnCancel = {
  onCancel: () => {
    throw new Error('[fab-card-registry] set import cancelled — nothing was saved.');
  },
};

// Strip the time component and pin to UTC midnight so dates compare cleanly and stay timezone-stable.
const toDateOnly = (date: Date): Date =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

const dateKey = (date: Date): string => date.toISOString().slice(0, 10);

type PendingSet = { name: string; group: string; releaseDate: Date };

const loadGroupNames = async (repository: ISetGroupRepository): Promise<string[]> => {
  const result = await repository.findAll();
  if (!result.ok) throw result.error;
  return result.value.map((group) => group.name);
};

const resolveGroup = async (
  setName: string,
  groupRepository: ISetGroupRepository,
  createGroup: CreateSetGroupUseCase,
): Promise<string> => {
  const groups = await loadGroupNames(groupRepository);

  const { choice } = await prompts(
    {
      type: 'select',
      name: 'choice',
      message: `Group for "${setName}"`,
      choices: [
        ...groups.map((group) => ({ title: group, value: group })),
        { title: '＋ Create new group…', value: CREATE_NEW_GROUP },
      ],
    },
    abortOnCancel,
  );

  if (choice !== CREATE_NEW_GROUP) return choice as string;

  const { name } = await prompts(
    { type: 'text', name: 'name', message: 'New group name' },
    abortOnCancel,
  );

  const created = await createGroup.execute({ name });
  if (!created.ok) {
    console.log(`  ✗ ${created.error.message}`);
    return resolveGroup(setName, groupRepository, createGroup);
  }

  return name.trim();
};

const askReleaseDate = async (setName: string): Promise<Date> => {
  const { date } = await prompts(
    { type: 'date', name: 'date', message: `Release date for "${setName}"`, mask: 'YYYY-MM-DD' },
    abortOnCancel,
  );

  return toDateOnly(date as Date);
};

// Same-date sets have no inherent order, so ask the user to rank them (assigning releaseOrder).
const askOrdering = async (key: string, sets: PendingSet[]): Promise<PendingSet[]> => {
  console.log(`[fab-card-registry] ${sets.length} sets share the release date ${key}:`);

  const remaining = [...sets];
  const ordered: PendingSet[] = [];

  while (remaining.length > 1) {
    const { index } = await prompts(
      {
        type: 'select',
        name: 'index',
        message: `Which comes next (position ${ordered.length + 1})?`,
        choices: remaining.map((set, i) => ({ title: set.name, value: i })),
      },
      abortOnCancel,
    );
    ordered.push(remaining.splice(index as number, 1)[0]);
  }

  ordered.push(remaining[0]);
  return ordered;
};

const assignReleaseOrders = async (
  pending: PendingSet[],
  existingSets: SetRelease[],
): Promise<SetReleaseInput[]> => {
  const byDate = new Map<string, PendingSet[]>();
  for (const set of pending) {
    const key = dateKey(set.releaseDate);
    const bucket = byDate.get(key);
    if (bucket) bucket.push(set);
    else byDate.set(key, [set]);
  }

  const resolved: SetReleaseInput[] = [];
  for (const [key, sets] of byDate) {
    const existingOnDate = existingSets.filter((set) => dateKey(set.releaseDate) === key);
    const startOrder =
      existingOnDate.length === 0
        ? 0
        : Math.max(...existingOnDate.map((set) => set.releaseOrder)) + 1;

    const ordered = sets.length > 1 ? await askOrdering(key, sets) : sets;
    ordered.forEach((set, index) => {
      resolved.push({ ...set, releaseOrder: startOrder + index });
    });
  }

  return resolved;
};

export const importSetReleases = async ({
  setGroupRepository,
  setReleaseRepository,
  createSetGroup,
  importSetReleasesUseCase,
}: SetReleaseImportDependencies): Promise<void> => {
  const existingSetsResult = await setReleaseRepository.findAll();
  if (!existingSetsResult.ok) throw existingSetsResult.error;
  const existingSets = existingSetsResult.value;

  const knownNames = new Set(existingSets.map((set) => set.name));
  const newSetNames = Object.values(Release).filter((name) => !knownNames.has(name));

  if (newSetNames.length === 0) {
    console.log('[fab-card-registry] no new sets to import.');
    return;
  }

  console.log(`[fab-card-registry] ${newSetNames.length} new set(s) to import.`);

  const pending: PendingSet[] = [];
  for (const name of newSetNames) {
    const group = await resolveGroup(name, setGroupRepository, createSetGroup);
    const releaseDate = await askReleaseDate(name);
    pending.push({ name, group, releaseDate });
  }

  const sets = await assignReleaseOrders(pending, existingSets);

  const result = await importSetReleasesUseCase.execute({ sets });
  if (!result.ok) throw result.error;

  console.log(`[fab-card-registry] synced ${sets.length} set releases.`);
};
