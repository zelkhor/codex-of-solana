import { ModeToggle } from '@/shared/ui/ModeToggle.tsx';
import { MultiSelect } from '@/shared/ui/MultiSelect.tsx';

import { FILTER_MODE_OPTIONS } from '../filter-mode-options.ts';
import { useClassFilterViewModel } from './class-filter.view-model.ts';

export const ClassFilter = () => {
  const vm = useClassFilterViewModel();

  return (
    <div className="space-y-1.5">
      <div className="pt-2">
        <ModeToggle
          options={FILTER_MODE_OPTIONS}
          value={vm.classFilterMode}
          onChange={vm.setClassFilterMode}
        />
      </div>
      <MultiSelect
        options={vm.options}
        selected={vm.classes}
        onChange={vm.setClasses}
        placeholder="e.g. Assassin, Brute, Warrior, ..."
      />
    </div>
  );
};
