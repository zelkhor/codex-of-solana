import { Select } from '@/shared/ui/Select.tsx';
import { Toggle } from '@/shared/ui/Toggle.tsx';

import { useSortSectionViewModel } from './sort-section.view-model.ts';

export const SortSection = () => {
  const vm = useSortSectionViewModel();

  return (
    <div className="space-y-3 pt-1">
      <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">Sort</h2>
      <div className="flex items-start gap-3">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0 w-20 pt-2">
          Order
        </span>
        <Select
          value={vm.sortOrderValue}
          disabled={vm.isSortDisabled}
          onChange={(v) => vm.setSortOrder(v as never)}
          className="flex-1"
          options={vm.sortOrderOptions}
        />
      </div>
      <Toggle label="Group printings" checked={vm.groupPrintings} onChange={vm.setGroupPrintings} />
    </div>
  );
};
