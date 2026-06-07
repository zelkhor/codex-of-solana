import { HEROES, type HeroT } from '@codex/core';

import { SingleSelect } from '@/shared/ui/SingleSelect.tsx';

const HERO_OPTIONS = Object.values(HEROES).sort((a, b) => a.localeCompare(b));

const HeroAvatar = ({ name }: { name: string }) => (
  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-300 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 text-[10px] font-semibold shrink-0">
    {name[0]}
  </span>
);

interface HeroFilterProps {
  value: HeroT | null;
  onChange: (hero: HeroT | null) => void;
}

export const HeroFilter = ({ value, onChange }: HeroFilterProps) => (
  <SingleSelect
    options={HERO_OPTIONS}
    value={value}
    onChange={onChange}
    placeholder="Any hero"
    clearLabel="Any hero"
    renderLeading={(name) => <HeroAvatar name={name} />}
  />
);
