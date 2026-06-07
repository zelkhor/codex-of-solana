import { SingleSelect } from '@/shared/ui/SingleSelect.tsx';

import { useHeroFilterViewModel } from './hero-filter.view-model.ts';

const HeroAvatar = ({ name }: { name: string }) => (
  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-300 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 text-[10px] font-semibold shrink-0">
    {name[0]}
  </span>
);

export const HeroFilter = () => {
  const vm = useHeroFilterViewModel();

  return (
    <SingleSelect
      options={vm.options}
      value={vm.hero}
      onChange={vm.setHero}
      placeholder="Any hero"
      clearLabel="Any hero"
      renderLeading={(name) => <HeroAvatar name={name} />}
    />
  );
};
