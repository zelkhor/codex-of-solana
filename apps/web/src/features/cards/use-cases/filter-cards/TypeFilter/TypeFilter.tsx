import { ModeToggle } from '@/shared/ui/ModeToggle.tsx';
import { MultiSelect } from '@/shared/ui/MultiSelect.tsx';

import { FILTER_MODE_OPTIONS } from '../filter-mode-options.ts';
import { useTypeFilterViewModel } from './type-filter.view-model.ts';

export const TypeFilter = () => {
  const vm = useTypeFilterViewModel();

  return (
    <div className="space-y-1.5">
      <div className="pt-2">
        <ModeToggle
          options={FILTER_MODE_OPTIONS}
          value={vm.typeFilterMode}
          onChange={vm.setTypeFilterMode}
        />
      </div>
      <MultiSelect
        options={vm.options}
        selected={vm.types}
        onChange={vm.setTypes}
        placeholder="e.g. Action, Hero, Weapon, ..."
      />
    </div>
  );
};
