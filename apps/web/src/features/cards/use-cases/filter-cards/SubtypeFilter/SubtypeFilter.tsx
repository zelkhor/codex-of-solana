import { ModeToggle } from '@/shared/ui/ModeToggle.tsx';
import { MultiSelect } from '@/shared/ui/MultiSelect.tsx';

import { FILTER_MODE_OPTIONS } from '../filter-mode-options.ts';
import { useSubtypeFilterViewModel } from './subtype-filter.view-model.ts';

export const SubtypeFilter = () => {
  const vm = useSubtypeFilterViewModel();

  return (
    <div className="space-y-1.5">
      <div className="pt-2">
        <ModeToggle
          options={FILTER_MODE_OPTIONS}
          value={vm.subtypeFilterMode}
          onChange={vm.setSubtypeFilterMode}
        />
      </div>
      <MultiSelect
        options={vm.options}
        selected={vm.subtypes}
        onChange={vm.setSubtypes}
        placeholder="e.g. Arrow, Item, Trap, ..."
      />
    </div>
  );
};
